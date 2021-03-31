import React, { useState } from 'react';

import DATAMatrix from '/client/utility/datamatrix-svg/datamatrix.js';

const IdCardCard = ({ user })=> {
  
  const [ ready, readySet ] = useState(false);
  const [ bad, badSet ] = useState(false);
  const [ goodPass, goodPassSet ] = useState(false);
  
  function checkPassword(e) {
    e.preventDefault();
    const passVal = this.passwordInput.value;
    
    Meteor.call('dbblCheckPassword', passVal, (err, re)=>{
      err && console.log(err);
      if(re === true) {
        goodPassSet(passVal);
        badSet(false);
        readySet(true);
      }else{
        badSet(true);
      }
    });
  }
  
  function createMarkup() {

    const userstring = user.username + "<+>" + goodPass;
    
    const encoder = new TextEncoder();
    const ePass = encoder.encode(userstring).toString();
        
    let svgNode = DATAMatrix({
                    msg :  ePass,
                    dim :   150,
                    pal : ["#000000", "#ffffff"]
                  });
                  
    return {__html: svgNode.outerHTML};
  }
  
  const splitName = user.username.split('.');
	const fineName = splitName[1] ? splitName[0] + " " + splitName[1] : splitName[0];
	
  return(
    <div>
      <h3 className='noPrint'>
        <i className='fas fa-id-badge fa-fw'></i> Generate ID Card
      </h3>
      
      {!ready ?
        <span>
          <p>Confirm Your Password</p>
          <form onSubmit={(e)=>checkPassword(e)}>
            <input 
              type='password' 
              id='passwordInput'
              className='miniIn18'
              autoComplete="new-password"
              required />
            <button type='submit' className='smallAction clearBlack'>SUBMIT</button>
          </form>
          {bad && <p>Incorrect Password</p>}
        </span>
      :
        <span>
          <button
            title="Print Label"
            className='action clearBlack vmargin noPrint'
            onClick={()=> window.print()}
          ><i className='fas fa-print gapR'></i> Print</button>
          
          <div className='userCard'>
            <div className='userCardContent'>
              <n-username class='centreText wordBr cap'>{fineName}</n-username>
              <span dangerouslySetInnerHTML={createMarkup()} />
            </div>
            
          </div>
        </span>
      }
    </div>
  );
};

export default IdCardCard;