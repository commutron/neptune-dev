Meteor.methods({
  
  sendEmail(to, from, subject) {
    const check = (val)=> typeof val === 'string';
    if(check(to) && check(from) && check(subject)) {
      this.unblock();
      
      const bcc = 'matt@commutron.ca';
      
      const html = `
        <table style="min-width:140px;max-width:600px;width:80%;margin:0 auto;font-family:Verdana, sans-serif;line-height:1;table-layout:auto;background-color:white">
          <tbody>
            <tr><td colspan='2' style="background-color:#2781c3;width:100%;height:15px"></td></tr>
            <tr>
              <td style="padding:0 10px">
                <div style="text-align:center">
                <span style="letter-spacing:1px;font-weight: 900;font-size:30px;color:black">COMMUTRON</span>
                <br /><span class='sub' style="font-weight:600;font-size:20px;letter-spacing:4px;color:#2878ba">Industries Ltd</t>
                </div></td>
              <td style="text-align:center;padding:0 10px;font-size:20px;font-weight:600;letter-spacing:1px;color:black">306-854-2265</td>
            </tr>
            <tr><td colspan='2' style="background-color:#2769ac;width:100%;height:15px"></td></tr>
            <tr>
              <td colspan='2' style="padding:20px 10%;text-align:center;line-height: 1.5"
                  ><p style="color:black">Automated message for [[ YOUR CUSTOMER NAME ]].</p>
                  <p style="color:black">Your product <i>[[ XXXXXXX v.XX ]]</i> of sales order <i>[[ XXXXX ]]</i> was <b>released to the floor</b> on Wednesday July 14th 2021 at 2:53pm (CST).</p>
                <p style="color:black">Do not reply to this email.</p>
              </td>
            </tr>
            <tr>
              <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#254690;"
                >Customer Support: <a href="mailto: jeff@commutron.ca" style="color:white">jeff@commutron.ca</a></td>        
            </tr>
            <tr>
              <td colspan='2' style="text-align:center;padding:15px;color:white;background-color:#000;"
                >302 Stanley Street, Elbow, Saskatchewan, S0H 1J0</td>
            </tr>
          </tbody>
        </table>`;
        
      const text = `COMMUTRON Industries Ltd.
      
      Automated message for Mao-Kwikowski Mercantile. 
      
      Your product GY0235-5E v.6b of sales order 1223dd was 
      -- released to the floor -- 
      on Wednesday July 14th 2021 at 2:53pm (CST).
      
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