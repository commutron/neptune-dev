import moment from 'moment';
import Config from '/server/hardConfig.js';
import { toCap } from './utility';

function sendInternalEmail(to, subject, date, title, body, asid, foot, link) {
  const from = Config.sendEmail;
    
  const html = `
    <table style="min-width:140px;max-width:600px;width:80%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;table-layout:auto;border-collapse:separate;background-color:white">
      <tbody>
        <tr style="background-color:#007fff;height:50px;color:white">
          <td style="padding:0 10px">
            <div style="text-align:center">
              <span style="letter-spacing:1px;font-weight:900;font-size:30px">Neptune</span>
            </div>
          </td>
          <td style="text-align:center;padding:0 10px;font-size:16px;font-weight:600;letter-spacing:1px;line-height:30px">Automated Email</td>
        </tr>
        <tr>
          <td colspan='2' class='body' style="padding:20px 10%;line-height: 1.5">
            <p style="color:black;margin:1rem 0">${title}</p>
            <p style="color:black;margin:1rem 0">${date}</p>
            <p style="color:black;margin:1rem 0">${body}</p>
            <p style="color:black;margin:1rem 0"><small>${asid}</small></p>
            <p style="color:black;margin:1rem 0">${foot}</p>
            <p style="color:black;margin:1rem 0">${link}</p>
            <p style="color:black;margin:1em 0"><em>Do not reply to this email.</em></p>
          </td>
        </tr>
        <tr>
          <td colspan='2' style="background-color:#007fff;width:100%;height:25px"></td>
        </tr>
      </tbody>
    </table>`;
    
  const text = `Neptune Automated Message\n\n${title}\n\n${date}\n\n${body}\n\n${asid}\n\n${foot}\n\ndo not reply to this email`;

  Email.send({ to, from, subject, html, text });

}

function sendExternalEmail(to, cc, subject, date, body, foot, plainbody) {
  const from = Config.sendEmail;
    
  const html = `
    <table style="min-width:140px;max-width:600px;width:80%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;table-layout:auto;border-collapse:separate;background-color:white">
      <tbody>
        <tr><td colspan='2' style="background-color:#2781c3;width:100%;height:15px"></td></tr>
        <tr>
          <td style="padding:0 10px">
            <div style="text-align:center">
            <span style="letter-spacing:1px;font-weight:900;font-size:30px;color:black">COMMUTRON</span>
            <br /><span style="font-weight:600;font-size:20px;letter-spacing:4px;color:#2878ba">Industries Ltd</span>
            </div></td>
          <td style="text-align:center;padding:0 10px;font-size:20px;font-weight:600;letter-spacing:1px;color:black">Automated Email</td>
        </tr>
        <tr><td colspan='2' style="background-color:#2769ac;width:100%;height:15px"></td></tr>
        <tr>
          <td colspan='2' style="padding:20px 10%;text-align:center;line-height: 1.5">
            <p style="color:black;margin:1rem 0">${date} (CST)</p>
            <p style="color:black;margin:1rem 0">${body}</p>
            <p style="color:black;margin:1rem 0">${foot}</p>
            <p style="color:black;margin:1em 0">Do not reply to this email address. If you have any questions, please contact a member of our customer service team directly.</p>
          </td>
        </tr>
        <tr>
          <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#254690;"
            >Customer Service: <a href="tel:+${Config.orgTel}" style="color:white">${Config.orgPhone}</a></td>        
        </tr>
        <tr>
          <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#000;"
            >${Config.orgStreet}</td>
        </tr>
      </tbody>
    </table>`;
    
  const text = `COMMUTRON Industries Ltd.\n\nAutomated message\n\n${date}(CST)\n\n${plainbody}\n\ndo not reply to this email\n\nCustomer Service: ${Config.orgPhone}\n${Config.orgStreet}`;
  
  Email.send({ to, cc, from, subject, html, text });
}

function sortInternalRecipient(emailUserIDs, subject, date, title, body, asid, foot, link) {
  let emails = [];
  let ininbox = [];
  
  for(let eu of emailUserIDs) {
    const user = Meteor.users.findOne({_id: eu});
    if(user && user.emails && user.emails[0]) {
      emails.push(user.emails[0]);
    }else{
      ininbox.push(eu);
    }
  }
  
  if(emails.length > 0) {
        
    let addresses = Array.from(emails, e => e.address );
    
    sendInternalEmail( addresses, subject, date, title, body, asid, foot, link );
    
    EmailDB.insert({
      sentTime: new Date(),
      subject: subject,
      to: addresses.toString(),
      cc: undefined,
      text: body
    });
  }
  
  if(ininbox.length > 0) {
    const mssgDetail = title + '. ' + body + '. ' + foot + '.';

    for(let inboxID of ininbox) {
      Meteor.users.update(inboxID, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: 'direct',
          type: 'direct',
          title: subject,
          detail: mssgDetail,
          time: new Date(),
          unread: true
        }
      }});
    }
  }
  
}
  
Meteor.methods({
  
  sendTestEmail(to, subject) {
    this.unblock();
    
    const from = Config.sendEmail;
    
    const name = Meteor.user().username.replace('.', ' ').replace('_', ' ');
    
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject)) {
      
      const date = moment().tz(Config.clientTZ).format('h:mm:ss a, dddd, MMM Do YYYY');
      const title = "Email Test";
      const body = `Sent by ${name}`;
      const foot = "no action required";
      const link = '';
      
      sendInternalEmail(to, subject, date, title, body, foot, link);
      
      EmailDB.insert({
        sentTime: new Date(),
        subject: title,
        to: to,
        cc: undefined,
        text: body
      });
    }
  },
  
  
  handleExternalEmail(accessKey, emailPrime, emailSecond, isW, salesOrder) {
    this.unblock();
    const app = AppDB.findOne({orgKey: accessKey},{fields:{'emailGlobal':1,'describe':1}});
    const emailGlobal = app && app.emailGlobal;
    
    if(emailGlobal) {
      
      const to = emailPrime;
        
      const cc = emailSecond || undefined;
      
      const subject = `Production Notice For Order ${salesOrder}`;
      
      const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
      
      const body = `Your order ${'<b>'}${salesOrder}${'</b>'} of ${'<b>'}${toCap(isW, true)}${'</b>'} has ${'<b>'}Entered Production${'</b>'}`;
      const foot = 'Once your order is completed, a packing slip will be provided.';
      
      const plainbody = `Your order — ${salesOrder} — of — ${toCap(isW, true)} — has Entered Production`;
      
      sendExternalEmail( to, cc, subject, date, body, foot, plainbody );
      
      EmailDB.insert({
        sentTime: new Date(),
        subject: 'Production Release',
        to: to ? to.toString() : undefined,
        cc: cc ? cc.toString() : undefined,
        text: plainbody
      });
      
      return true;
    }else{
      return false;
    }
  },
  
  
  handleInternalEmail(accessKey, emailUsers, name, isG, isW, variant, wiki) {
    this.unblock();
    const doc = AppDB.findOne({orgKey: accessKey});
    const emailGlobal = doc && doc.emailGlobal;
    
    if(emailGlobal) {
      const subject = `New Product Variant - ${variant} - automated Neptune email`;
      
      const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
      
      const title = `Concerning ${toCap(isG, true)}`;
      const body = `${toCap(name, true)} has created variant ${variant} of ${toCap(isW, true)}`;
      const asid = '';
      const foot = 'Expect Bill Of Material changes. Please prepare for potentially new stencils, jigs and machine programmes.';
      const link = wiki ? `<a href="${wiki}">Work Instructions</a>` : 'New work instructions will be forthcoming';
      
      
      sortInternalRecipient(emailUsers, subject, date, title, body, asid, foot, link);
    }
  },
  
  handleInternalPCBEmail(accessKey, isG, isW, wiki) {
    this.unblock();
    const doc = AppDB.findOne({orgKey: accessKey});
    const emailGlobal = doc && doc.emailGlobal;
    const emailpcbKit = doc && doc.emailpcbKit;
    
    if(emailGlobal && emailpcbKit) {
      const subject = `New PCBs Received - ${toCap(isW, true)} - automated Neptune email`;
      
      const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
      
      const title = `Concerning ${toCap(isG, true)}`;
      const body = `Kitting has received PCBs for ${toCap(isW, true)}.`;
      const asid = '(The Upstream clearance "Barcoding / PCB" is marked as "Ready", indicating that the base barcoded components are in stock. These are usually, but not always, printed circuit boards.)';
      const foot = 'A work order of this product variant has never been completed. New stencils, jigs or machine programmes may be required.';
      const link = `<a href="${wiki}">Work Instructions</a>`;
      
      sortInternalRecipient(emailpcbKit, subject, date, title, body, asid, foot, link);
    }
  },
  
  handleInternalMaintEmail(accessKey, emailUserIDs, equip, name, state, deadline) {
    this.unblock();
    const doc = AppDB.findOne({orgKey: accessKey});
    const emailGlobal = doc && doc.emailGlobal;
    
    if(emailGlobal) {
      const dead = deadline ? false :
                    moment(deadline).tz(Config.clientTZ).format('dddd, MMM Do');
                
      const subject = `Scheduled Maintenance is Not Completed`;
      
      const date = moment().tz(Config.clientTZ).format('dddd, MMM Do YYYY');
      
      const title = `Concerning ${toCap(equip, true)}`;
      const body = `${toCap(name)} scheduled maintenance is incomplete and past its ${state}.`;
      const asid = dead ? `A short grace period is in effect but maintenance must be completed by end of day ${dead}.` : '';
      const foot = '';
      const link = dead ? "To stop receiving emails concerning this equipment, remove your name from the equipment's assigned stewards" :
                          "To stop receiving emails concerning missed maintenance, disable your 'equipSuper' authorization";
      
      sortInternalRecipient(emailUserIDs, subject, date, title, body, asid, foot, link);
    }
  },
  
  fetchEmailLog() {
    if(Roles.userIsInRole(Meteor.userId(), ['admin','run','kitting','sales'])) {
      const logs = EmailDB.find({}).fetch();
      
      const flat = JSON.stringify(logs);
      
      return flat;
    }
  },
  
  removeEmailLog() {
    if(Roles.userIsInRole(Meteor.userId(), ['admin','run','kitting'])) {
      EmailDB.remove({});
      return true;
    }
  }
  
  
});