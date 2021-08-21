import moment from 'moment';
import Config from '/server/hardConfig.js';
import { toCap } from './utility';

function sendInternalEmail(to, subject, date, title, body, foot, link) {
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
            <p style="color:black;margin:1rem 0">${foot}</p>
            <p style="color:black;margin:1rem 0">${link}</p>
            <p style="color:black;margin:1em 0">Do not reply to this email.</p>
          </td>        
        </tr>
        <tr>
          <td colspan='2' style="background-color:#007fff;width:100%;height:25px"></td>
        </tr>
      </tbody>
    </table>`;
    
  const text = `Neptune Automated Message\n\n${title}\n\n${date}\n\n${body}\n\n${foot}\n\ndo not reply to this email`;

  Email.send({ to, from, subject, html, text });

}

function sendExternalEmail(to, cc, bcc, subject, date, body, plainbody) {
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
            
            <p style="color:black;margin:1rem 0">${date}</p>
            <p style="color:black;margin:1rem 0">${body}</p>
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
  
  Email.send({ to, bcc, from, subject, html, text });
}
  
  
Meteor.methods({
  
  sendTestEmail(to, subject) {
    const from = Config.sendEmail;
    
    const name = Meteor.user().username.replace('.', ' ').replace('_', ' ');
    
    if(check(to) && check(from) && check(subject)) {
      this.unblock();
      
      const date = new Date().toLocaleString();
      const title = "Email Test";
      const body = `Sent by ${name}`;
      const foot = "no action required";
      const link = '';
      
      sendInternalEmail(to, subject, date, title, body, foot, link);
    }
  },
  
  
  handleExternalEmail(accessKey, emailPrime, emailSecond, isG, isW, salesOrder) {
    this.unblock();
    const doc = AppDB.findOne({orgKey: accessKey},{fields:{'emailGlobal':1,'describe':1}});
    const emailGlobal = doc && doc.emailGlobal;
    
    if(emailGlobal) {
      
      const check = (val)=> typeof val === 'string';
      
      if(check(to) && check(subject)) {
      
        const to = emailPrime;
        
        const cc = emailSecond || undefined;
        
        const bcc = emailBCC || undefined;
        
        const subject = `Production Notice For Order ${salesOrder}`;
        
        const date = moment().tz(Config.clientTZ).format('hh:mm a, dddd, MMM Do YYYY');
        
        const body = `Your order <i>${salesOrder}</i> of <i>${toCap(isW, true)}</i> has <b>Entered Production</b>`;
        // const foot = 'Once your order is completed, a packing slip may be provided.';
        
        const plainbody = `Your order — ${salesOrder} — of — ${toCap(isW, true)} — has Entered Production`;
        
        sendExternalEmail( to, cc, bcc, subject, date, body, plainbody );
        
        EmailDB.insert({
          sentTime: new Date(),
          subject: 'Production Release',
          to: to.toString(),
          cc: cc.toString(),
          bcc: bcc,
          text: plainbody
        });
      }
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
      const subject = `New Product - ${variant} - automated email from Neptune`;
      
      const date = moment().tz(Config.clientTZ).format('hh:mm a, dddd, MMM Do YYYY');
      
      const title = `Concerning ${toCap(isG, true)}`;
      const body = `${toCap(name, true)} has created variant ${variant} of ${toCap(isW, true)}`;
      const foot = 'Expect Bill Of Material changes. Please prepare for potentially new stencils, jigs and machine programmes.';
      const link = wiki ? `<a href="${wiki}">Work Instructions</a>` : 'New work instructions will be forthcoming';
      
      let emails = [];
      let ininbox = [];
      
      for(let eu of emailUsers) {
        const user = Meteor.users.findOne({_id: eu});
        if(user && user.emails && user.emails[0]) {
          emails.push(user.emails[0]);
        }else{
          ininbox.push(eu);
        }
      }
    
      if(emails.length > 0) {
        
        let addresses = Array.from(emails, e => e.address );
        
        sendInternalEmail( addresses, subject, date, title, body, foot, link );
        
        EmailDB.insert({
          sentTime: new Date(),
          subject: 'New Product Variant',
          to: addresses.toString(),
          cc: undefined,
          bcc: undefined,
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
  },
  
  fetchEmailLog() {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      const logs = EmailDB.find({}).fetch();
      
      const flat = JSON.stringify(logs);
      
      return flat;
    }
  },
  
  removeEmailLog(logID) {
    if(Roles.userIsInRole(Meteor.userId(), 'run')) {
      EmailDB.remove(logID);
      return true;
    }
  }
  
  
});