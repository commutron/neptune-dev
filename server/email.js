import moment from 'moment';
import Config from '/server/hardConfig.js';
import { toCap } from './utility';

function sendInternalEmail(to, subject, date, title, body, foot) {
  const from = Config.sendEmail;
    
  const html = `
    <table style="min-width:140px;max-width:600px;width:80%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;table-layout:auto;border-collapse:separate;background-color:white">
      <tbody>
        <tr style="background-color:#007fff;height:50px">
          <td style="padding:0 10px">
            <div style="text-align:center">
              <span style="letter-spacing:1px;font-weight:900;font-size:30px">Neptune</span>
            </div>
          </td>
          <td style="text-align:center;padding:0 10px;font-size:16px;font-weight:600;letter-spacing:1px;line-height:30px">Automated Email</td>
        </tr>
        <tr>
          <td colspan='2' class='body' style="padding:20px 10%;text-align:center;line-height: 1.5">
            <p style="color:black;margin:1rem 0">${title}</p>
            <p style="color:black;margin:1rem 0">${date}</p>
            <p style="color:black;margin:1rem 0">${body}</p>
            <p style="color:black;margin:1rem 0">${foot}</p>
            <p style="color:black;margin:1em 0">Do not reply to this email.</p>
          </td>        
        </tr>
        <tr>
          <td colspan='2' style="background-color:#007fff;width:100%;height:10px"></td>
        </tr>
      </tbody>
    </table>`;
    
  const text = `Neptune Automated Message\n\n${title}\n\n${date}\n\n${body}\n\n${foot}\n\ndo not reply to this email`;

  Email.send({ to, from, subject, html, text });

}
  
  
Meteor.methods({
  
  sendEmail(to, subject) {
    const from = Config.sendEmail;
    
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject)) {
      this.unblock();
      
      const bcc = 'matt@commutron.ca';
      
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
                
                <p style="color:black;margin:1em 0">Automated message for [[ YOUR CUSTOMER NAME ]].</p>
                <p style="color:black;margin:1em 0">Your product <i>[[ XXXXXXX v.XX ]]</i> of sales order <i>[[ XXXXX ]]</i> was <b>released to the floor</b> on Wednesday July 14th 2021 at 2:53pm (CST).</p>
                <p style="color:black;margin:1em 0">Do not reply to this email.</p>
              </td>
            </tr>
            <tr>
              <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#254690;"
                >Customer Support: <a href="tel:+${Config.orgTel}" style="color:white">${Config.orgPhone}</a></td>        
            </tr>
            <tr>
              <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#000;"
                >${Config.orgStreet}</td>
            </tr>
          </tbody>
        </table>`;
        
      const text = `COMMUTRON Industries Ltd.\n\nAutomated message for XXXXXXXXXXX.\n\nYour product XXXXXXXX v.XX of sales order XXXXXX was\n++ released to the floor ++\non Wednesday July 14th 2021 at 2:53pm (CST).\n\ndo not reply to this email\n\nCustomer Support: ${Config.orgPhone}\n${Config.orgStreet}`;
      
      Email.send({ to, bcc, from, subject, html, text });
      
      return true;
    }else{
      return false;
    }
  },
  
  
  handleInternalEmail(accessKey, emailUsers, name, isG, isW, variant) {
    this.unblock();
    const doc = AppDB.findOne({orgKey: accessKey});
    const emailGlobal = doc && doc.emailGlobal;
    
    if(emailGlobal) {
      const subject = `New Product - ${variant} - automated email from Neptune`;
      
      const date = moment().tz(Config.clientTZ).format('hh:mm a, dddd, MMM Do YYYY');
      
      const title = `Concerning ${isG}`;
      const body = `${toCap(name, true)} has created variant ${variant} of ${toCap(isW, true)}`;
      const foot = 'Be prepared for new tooling including stencils, jigs and machine programmes.';
      
      
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
        
        sendInternalEmail( addresses, subject, date, title, body, foot );
        
        // log email db
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
  }
  
  
});