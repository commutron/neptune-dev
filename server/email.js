import moment from 'moment';
import Config from '/server/hardConfig.js';
import Pref from '/public/pref.js';
import { toCap } from './utility';


function sendInternalEmail(to, subject, date, title, body, asid, foot, link, fine) {
  const from = '"Neptune" ' + Config.sendEmail;
  
  const html = `
    <table style="min-width:140px;max-width:600px;width:80%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;table-layout:auto;border-collapse:separate;background-color:white">
      <tbody>
        <tr style="background-color:#007fff;height:50px;color:white">
          <td style="padding:0 10px">
            <div style="text-align:center">
              <span style="letter-spacing:1px;font-weight:900;font-size:30px">Neptune</span>
            </div>
          </td>
          <td style="text-align:center;padding:0 10px;font-size:16px;font-weight:600;letter-spacing:1px;line-height:20px">Automated Email</td>
        </tr>
        <tr>
          <td colspan='2' class='body' style="padding:20px 10%;line-height: 1.5">
            <p style="color:black;margin:1rem 0">${title}</p>
            <p style="color:black;margin:1rem 0">${date}</p>
            <p style="color:black;margin:1rem 0">${body}</p>
            <p style="color:black;margin:1rem 0"><small>${asid}</small></p>
            <p style="color:black;margin:1rem 0">${foot}</p>
            <p style="color:black;margin:1rem 0">${link}</p>
            <p style="color:black;margin:1rem 0"><small>${fine}</small></p>
          </td>
        </tr>
        <tr>
          <td colspan='2' style="background-color:#007fff;width:100%;height:25px"></td>
        </tr>
      </tbody>
    </table>`;
    
  const text = `Neptune Automated Message\n\n${title}\n\n${date}\n\n${body}\n\n${asid}\n\n${foot}\n\n${link}\n\n${fine}`;

  Email.send({ to, from, subject, html, text });

}

function sendExternalEmail(to, cc, subject, date, body, foot, flvr, fine, plainbody) {
  const from = '"' + Config.orgName  + '" ' + Config.sendEmail;
  const replyTo = Config.replyEmail;
  
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
            <p style="color:black;margin:1rem 0">${foot}</p>
            <p style="color:black;margin:1rem 0">${flvr}</p>
            <p style="color:black;margin:1rem 0"><small>${fine}</small></p>
          </td>
        </tr>
        <tr>
          <td colspan='2' style="text-align:center;padding:15px;color:white;line-height:1.3;background-color:#254690;"
            >Customer Service: <a href="mailto:${Config.replyEmail}" style="color:white">${Config.replyEmail}</a>, <a href="tel:+${Config.orgTel}" style="color:white">${Config.orgPhone}</a></td>        
        </tr>
        <tr>
          <td colspan='2' style="text-align:center;padding:15px;color:white;line-height:1.3;background-color:#000;"
            >${Config.orgStreet}</td>
        </tr>
      </tbody>
    </table>`;
    
  const text = `COMMUTRON Industries Ltd.\n\nAutomated message\n\n${date}(CST)\n\n${plainbody}\n\n\nCustomer Service: ${Config.replyEmail}\n${Config.orgPhone}\n${Config.orgStreet}`;
  
  Email.send({ to, cc, from, replyTo, subject, html, text });
}

function sortInternalRecipient(accessKey, emailUserIDs, subject, date, title, body, asid, foot, link, fine) {
  const doc = AppDB.findOne({orgKey: accessKey});
  const emailGlobal = doc && doc.emailGlobal;
  const emailpcbKit = doc && doc.emailpcbKit;
  
  const sendIDs = emailUserIDs === 'APP_emailpcbKit' ? emailpcbKit : emailUserIDs;
    
  let emails = [];
  let ininbox = [];
  
  for(let eu of sendIDs) {
    const user = Meteor.users.findOne({_id: eu});
    if(emailGlobal && user && user.emails && user.emails[0]) {
      emails.push(user.emails[0]);
    }else{
      ininbox.push(eu);
    }
  }
  
  if(emails.length > 0) {
        
    let addresses = Array.from(emails, e => e.address );
    
    sendInternalEmail( addresses, subject, date, title, body, asid, foot, link, fine);
    
    EmailDB.insert({
      sentTime: new Date(),
      subject: subject,
      to: addresses.join(', '),
      cc: undefined,
      text: title + ' - ' + body
    });
  }
  
  if(ininbox.length > 0) {
    const mssgDetail = title + ' ' + body + ' ' + foot;

    for(let inboxID of ininbox) {
      Meteor.users.update(inboxID, {
        $push : { inbox : {
          notifyKey: new Meteor.Collection.ObjectID().valueOf(),
          keyword: 'automated',
          type: 'automated',
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
    const cc = undefined;
    
    const name = Meteor.user().username.replace('.', ' ').replace('_', ' ');
    
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject)) {
      
      const date = moment().tz(Config.clientTZ).format('h:mm:ss a, dddd, MMM Do YYYY');
      const title = "Email Test.";
      const body = `Sent by ${name}.`;
      const asid = '';
      const foot = "no action required.";
      const flvr = '';
      const link = '';
      const fine = '';
      
      const plainbody = `Email Test. — ${date}. — Sent by ${name}. — no action required.`;
      
      sendInternalEmail(to, subject, date, title, body, asid, foot, link, fine);
      
      sendExternalEmail( to, cc, subject, date, body, foot, flvr, fine, plainbody );
    }
  },
  
  handleErrorEmail(errorTitle, errorTime, errorUser, agent, sessionID, url, errorMessage) {
    this.unblock();
    const app = AppDB.findOne({},{fields:{'emailGlobal':1,'devEmail':1}});
    const emailGlobal = app && app.emailGlobal && app.devEmail;
    const to = app.devEmail;
    
    if(emailGlobal && to) {
      
      const subject = 'NEPTUNE ERROR REPORT';
      const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
      const title = errorTitle;
      
      const body = `v.${Pref.neptuneVersion}, ${errorUser}, ${agent}, ${url}`;
      const foot = `${errorTime} (session ${sessionID})`;
      const link = `${'<pre>'}${errorMessage}${'</pre>'}`;
      
      sendInternalEmail(to, subject, date, title, body, "-", foot, link, "-");
      
      return true;
    }else{
      return false;
    }
  },
  
  handleDevMonitorEmail() {
    this.unblock();
    const app = AppDB.findOne({},{fields:{'emailGlobal':1,'devEmail':1,'orgPIN':1,'workingHours':1}});
    const emailGlobal = app && app.emailGlobal && app.devEmail;
    const to = app.devEmail;
    
    if(emailGlobal && to) {
      
      const subject = 'NEPTUNE STATUS REPORT';
      const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
      const title = `Neptune is running version ${Pref.neptuneVersion}`;
      
      const pin = app.orgPIN;
      const hrs = JSON.stringify(app.workingHours);
      
      const db = Meteor.call("serverDatabaseSize");
      
      const body = `Users: ${db.u}, Groups: ${db.g}, Widgets: ${db.w}, Variants: ${db.v}, Batches: ${db.b}, Series(Items): ${db.i}, Rapids: ${db.r}, Traces: ${db.t}, Equips: ${db.e}, Maints: ${db.m}`;
      const asid = `OrgPIN: ${pin}`;
      const foot = `WorkingHours: ${hrs}`;
      const link = `config: tz:${Config.clientTZ} reply:${Config.replyEmail} tel:${Config.orgTel}`;
      
      sendInternalEmail(to, subject, date, title, body, asid, foot, link, ":P");
      
      return true;
    }else{
      return false;
    }
  },
  
  handleIntVarEmail(accessKey, emailUsers, name, isG, isW, variant, wiki) {
    this.unblock();
    
    const subject = `New Product Variant - ${variant} - automated Neptune email`;
    const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
    
    const title = `Concerning ${toCap(isG, true)}.`;
    const body = `${toCap(name, true)} has created variant ${variant} of ${toCap(isW, true)}.`;
    const asid = '';
    const foot = 'Expect Bill Of Material changes. Please prepare for potentially new stencils, jigs and machine programmes.';
    const link = wiki ? `<a href="${wiki}">Work Instructions</a>` : 'New work instructions will be forthcoming.';
    const fine = '';
    
    sortInternalRecipient(accessKey, emailUsers, subject, date, title, body, asid, foot, link, fine);
  },
  
  handleIntPCBEmail(accessKey, isG, isW, wiki) {
    this.unblock();
    
    const subject = `New PCBs Received - ${toCap(isW, true)} - automated Neptune email`;
    const date = moment().tz(Config.clientTZ).format('h:mm a, dddd, MMM Do YYYY');
    
    const title = `Concerning ${toCap(isG, true)}.`;
    const body = `Kitting has received PCBs for ${toCap(isW, true)}.`;
    const asid = '(The Upstream clearance "Barcoding / PCB" is marked as "Ready", indicating that the base barcoded components are in stock. These are usually, but not always, printed circuit boards.)';
    const foot = 'A work order of this product variant has never been completed. New stencils, jigs or machine programmes may be required.';
    const link = `<a href="${wiki}">Work Instructions</a>`;
    const fine = "To stop receiving emails concerning PCBs, contact receiving.";

    sortInternalRecipient(accessKey, 'APP_emailpcbKit', subject, date, title, body, asid, foot, link, fine);
  },
  
  handleIntMaintEmail(accessKey, emailUserIDs, equip, name, state, deadline) {
    this.unblock();
    const subject = "Scheduled Maintenance";
    const title = toCap(equip, true) + '.';
    const pmname = toCap(name);
    const date = '';
    const asid = '';
    const link = '';
    
    const dead = deadline ? moment(deadline).tz(Config.clientTZ).format('dddd, MMM Do') : "";
    
    if(state === 'did_not') {
      const body = `${pmname} maintenance was not completed.`;
      const foot = 'The PM event has been closed';
      const fine = "You have received this email because you are assigned the 'equipSuper' role.";
    
      sortInternalRecipient(accessKey, emailUserIDs, subject, date, title, body, asid, foot, link, fine);
    }else if(state === 'in_grace') {
      const body = `${pmname} maintenance has not been completed on time.`;
      const foot = `A short grace period is in effect but maintenance must be completed by ${dead} (end of workday).`;
      const fine = `You have received this email because you are assigned to the ${equip} or are assigned the 'equipSuper' role.`;
      
      sortInternalRecipient(accessKey, emailUserIDs, subject, date, title, body, asid, foot, link, fine);
    }else if(state === 'now_open') {
      const body = `${pmname} maintenance is required.`;
      const foot = `Maintenance should be completed by ${dead} (end of workday).`;
      const fine = `You have received this email because you are assigned to the ${equip}.`;
      
      sortInternalRecipient(accessKey, emailUserIDs, subject, date, title, body, asid, foot, link, fine);
    }else{null}
  },
  
  handleExtOrderEmail(accessKey, emailPrime, emailSecond, isW, salesOrder, salesEnd) {
    this.unblock();
    const app = AppDB.findOne({orgKey: accessKey},{fields:{'emailGlobal':1}});
    const emailGlobal = app && app.emailGlobal;
    
    if(emailGlobal) {
      
      const to = emailPrime;
      const cc = emailSecond || undefined;
      
      const subject = `Production Notice — ${salesOrder}`;
      
      const date = moment().tz(Config.clientTZ).format('h:mm a(CST), dddd, MMM Do YYYY');
      const dueDate = moment(salesEnd).tz(Config.clientTZ).format('dddd, MMMM Do YYYY');
      
      const body = `A Work Order has been issued for your sales order ${'<b>'}${salesOrder}${'</b>'} of ${'<b>'}${toCap(isW, true)}${'</b>'}.`;
      const foot = `Order due date is set for ${'<b>'}${dueDate}${'</b>'}.`;
      const flvr = '';
      
      const fine = 'A notice will be sent when this work order enters production.';
      
      const plainbody = `Work Order has been issued for your order — ${salesOrder} — of — ${toCap(isW, true)}.`;
      
      sendExternalEmail( to, cc, subject, date, body, foot, flvr, fine, plainbody );
      
      EmailDB.insert({
        sentTime: new Date(),
        subject: 'Work Order Issued',
        to: to ? to.toString() : undefined,
        cc: cc ? cc.toString() : undefined,
        text: plainbody
      });
      
      return true;
    }else{
      return false;
    }
  },
  
  handleExtUpdateEmail(accessKey, emailPrime, emailSecond, isW, salesOrder, salesEnd) {
    this.unblock();
    const app = AppDB.findOne({orgKey: accessKey},{fields:{'emailGlobal':1}});
    const emailGlobal = app && app.emailGlobal;
    
    if(emailGlobal) {
      
      const to = emailPrime;
      const cc = emailSecond || undefined;
      
      const subject = `Production Notice — ${salesOrder}`;
      
      const date = moment().tz(Config.clientTZ).format('h:mm a(CST), dddd, MMM Do YYYY');
      const dueDate = moment(salesEnd).tz(Config.clientTZ).format('dddd, MMMM Do YYYY');
      
      const body = `New ship due date for your sales order ${'<b>'}${salesOrder}${'</b>'} of ${'<b>'}${toCap(isW, true)}${'</b>'}.`;
      const foot = `Order due date is set for ${'<b>'}${dueDate}${'</b>'}.`;
      const flvr = '';
      
      const fine = 'Once your order is completed, a packing slip will be provided.';
      
      const plainbody = `Ship Due Date has been changed for your order — ${salesOrder} — of — ${toCap(isW, true)}.`;
      
      sendExternalEmail( to, cc, subject, date, body, foot, flvr, fine, plainbody );
      
      EmailDB.insert({
        sentTime: new Date(),
        subject: 'Due Date Change',
        to: to ? to.toString() : undefined,
        cc: cc ? cc.toString() : undefined,
        text: plainbody
      });
      
      return true;
    }else{
      return false;
    }
  },
  
  handleExtRelEmail(accessKey, emailPrime, emailSecond, isW, salesOrder, salesEnd, caution) {
    this.unblock();
    const app = AppDB.findOne({orgKey: accessKey},{fields:{'emailGlobal':1}});
    const emailGlobal = app && app.emailGlobal;
    
    if(emailGlobal) {
      
      const to = emailPrime;
      const cc = emailSecond || undefined;
      
      const subject = `Production Notice — ${salesOrder}`;
      
      const date = moment().tz(Config.clientTZ).format('h:mm a(CST), dddd, MMM Do YYYY');
      const dueDate = moment(salesEnd).tz(Config.clientTZ).format('dddd, MMMM Do YYYY');
      
      const body = `Your order ${'<b>'}${salesOrder}${'</b>'} of ${'<b>'}${toCap(isW, true)}${'</b>'} has ${'<b>'}Entered Production${'</b>'},`;
      const foot = `Order due date is set for ${'<b>'}${dueDate}${'</b>'}.`;
      const flvr = caution ? '** This order is begining with an expected part shortage. Contact customer service for details. **' : '';
      
      const fine = 'Once your order is completed, a packing slip will be provided.';
      
      const plainbody = `Your order — ${salesOrder} — of — ${toCap(isW, true)} — has Entered Production.`;
      
      sendExternalEmail( to, cc, subject, date, body, foot, flvr, fine, plainbody );
      
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
  
  fetchEmailLog() {
    if(Roles.userIsInRole(Meteor.userId(), ['admin','peopleSuper'])) {
      const logs = EmailDB.find({}).fetch();
      
      const flat = JSON.stringify(logs);
      
      return flat;
    }else{ 
      return JSON.stringify([]);
    }
  },
  
  removeEmailLog() {
    if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
      EmailDB.remove({});
      return true;
    }
  }
  
});