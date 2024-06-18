import React, { useState } from 'react';
import DATAMatrix from '/client/utility/datamatrix-svg/datamatrix.js';
import liteEncode from '/client/utility/liteEncode';

import './usercard.css';

const IdCardCard = ({ user })=> {
  
  const [ ready, readySet ] = useState(false);
  const [ bad, badSet ] = useState(false);
  const [ goodPass, goodPassSet ] = useState(false);
  
  function checkPassword(e) {
    e.preventDefault();
    const passVal = this.genpasswordInput.value;
    
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
    
    // const encoder = new TextEncoder();
    // const ePass = encoder.encode(userstring).toString();
    const ePass = liteEncode(userstring);
    
    let svgNode = DATAMatrix({
                    msg :  ePass,
                    dim :   128,
                    pal : ["#000000", "#ffffff"]
                  });

    return {__html: svgNode.outerHTML};
  }
  
  const splitName = user.username.split('.');
	const fineName = splitName[1] ? splitName[0] + " " + splitName[1] : splitName[0];
	
  return(
    <div className='minHeight'>
      
      {!ready ?
        <div className='bigInfoBox no'>
          <div><label htmlFor='genpasswordInput'>Confirm Your Password</label></div>
          <div>
            <form onSubmit={(e)=>checkPassword(e)}>
              <input 
                type='password' 
                id='genpasswordInput'
                className='miniIn18'
                autoComplete="new-password"
                required />
              <button type='submit' className='smallAction blackHover'>Generate</button>
            </form>
            {bad && <p>Incorrect Password</p>}
          </div>
        </div>
      :
        <span>
          <button
            title="Print Label"
            className='smallAction blackHover vmargin noPrint'
            onClick={()=> window.print()}
          ><i className='fas fa-print gapR'></i> Print</button>
          
          <div className='userCard'>
            <div className='userCardContent'>
              <img src='/neptune-logo-color.svg' className='alwaysPrint'/>
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