Meteor.methods({
  
  sendEmail(to, from, subject) {
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject)) {
      this.unblock();
      
      const bcc = 'matt@commutron.ca';
      
      const text = `
        <table style="min-width: 140px; width: 80%; height: 80%; margin: 0 auto; font-family: sans-serif; line-height: 1; table-layout: auto; border-collapse: collapse; background-color: white;">
          <tbody>
            <tr><td colspan='2' style="background-color:#61a1cf;width:100%;height:15px"></td></tr>
            <tr>
              <td style="padding:0 10px">
                <span style="letter-spacing:1px;font-weight: 900;font-size:30px">COMMUTRON</span>
                <br /><span class='sub' style="font-weight:600;padding-left:10px;font-size:20px;letter-spacing:6px;color:#0f75bc">Industries Ltd</t>
              </td>
              <td style="text-align:right;padding:0 10px;font-size:25px;font-weight:600;letter-spacing:1px">(306) 854-2265</td>
            </tr>
            <tr><td colspan='2' style="background-color:#4a93c9;width:100%;height:15px"></td></tr>
            <tr>
              <td colspan='2' class='body' style="padding:20px 15%;text-align:center;line-height: 1.5"
                  ><p>Automated message for Mao-Kwikowski Mercantile.</p>
                  <p>Your product <i>GY0235-5E v.6b</i> of sales order <i>1223dd</i> was <b>released to the shop floor</b> on Tuesday January 5th 2021 at 2:53pm (CST).</p>
                <p>Do not reply to this email. Please contact customer support at <a href="mailto: jeff@commutron.ca">jeff@commutron.ca</a>.</p>
              </td>        
            </tr>
            <tr>
              <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#205199;"
                >302 Stanley Street, Elbow, Saskatchewan, S0H 1J0</td>        
            </tr>
          </tbody>
        </table>`;
      
      Email.send({ to, bcc, from, subject, text });
      
      return true;
    }else{
      return false;
    }
  }
  
  
});