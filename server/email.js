Meteor.methods({
  
  sendEmail(to, from, subject) {
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject)) {
      this.unblock();
      
      const bcc = 'matt@commutron.ca';
      
      const html = `
        <table style="min-width:140px;wax-width:600px;width:80%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;table-layout:auto;background-color:white">
          <tbody>
            <tr><td colspan='2' style="background-color:#61a1cf;width:100%;height:15px"></td></tr>
            <tr>
              <td style="padding:0 10px">
                <div style="text-align:center">
                <span style="letter-spacing:1px;font-weight: 900;font-size:30px">COMMUTRON</span>
                <br /><span class='sub' style="font-weight:600;font-size:20px;letter-spacing:4px;color:#0f75bc">Industries Ltd</t>
                </div></td>
              <td style="text-align:center;padding:0 10px;font-size:20px;font-weight:600;letter-spacing:1px">306-854-2265</td>
            </tr>
            <tr><td colspan='2' style="background-color:#4a93c9;width:100%;height:15px"></td></tr>
            <tr>
              <td colspan='2' class='body' style="padding:20px 10%;text-align:center;line-height: 1.5"
                  ><p>Automated message for Mao-Kwikowski Mercantile.</p>
                  <p>Your product <i>GY0235-5E v.6b</i> of sales order <i>1223dd</i> was <b>released to the floor</b> on Wednesday July 14th 2021 at 2:53pm (CST).</p>
                <p>For support, do not reply to this email, please contact customer support at <a href="mailto: jeff@commutron.ca">jeff@commutron.ca</a>.</p>
              </td>
            </tr>
            <tr>
              <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#205199;"
                >302 Stanley Street, Elbow, Saskatchewan, S0H 1J0</td>        
            </tr>
          </tbody>
        </table>`;
        
      const text = `COMMUTRON Industries Ltd.
      
      Automated message for Mao-Kwikowski Mercantile. 
      
      Your product GY0235-5E v.6b of sales order 1223dd was released to the floor on Wednesday July 14th 2021 at 2:53pm (CST).
      
      For support, do not reply to this email, please contact customer support at jeff@commutron.ca.
      
      306-854-2265
      302 Stanley Street, Elbow, Saskatchewan, S0H 1J0`;
      
      Email.send({ to, bcc, from, subject, html, text });
      
      return true;
    }else{
      return false;
    }
  }
  
  
});