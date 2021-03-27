import React, { useState, Fragment } from 'react';
// import Pref from '/client/global/pref.js';
// import moment from 'moment';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import DATAMatrix from '/client/utility/datamatrix-svg/datamatrix.js';

const IdCardPanel = ({ app, user })=> {
  
  const [ ready, readySet ] = useState(false);
  
  const [ goodPass, goodPassSet ] = useState(false);
  
  function checkPassword(e) {
    e.preventDefault();
    const passVal = this.passwordInput.value;
    
    console.log(passVal);
    
    Meteor.call('dbblCheckPassword', passVal, (err, re)=>{
      err && console.log(err);
      if(re === true) {
        goodPassSet(passVal);
        readySet(true);
      }
    });
  }
  
  
  function createMarkup() {
    
    const userstring = user.username + '¶' + goodPass;
    const encodedData = window.btoa( userstring );
    const datastring = '§' + encodedData + '§';
    
    console.log(datastring);
    
    // user.name¶p@ssW0rD
    // §dXNlci5uYW1ltnBAc3NXMHJE§
    
    // malcolm.reynolds¶malmal
    // §bWFsY29sbS5yZXlub2xkc7ZtYWxtYWw=§
    
    let svgNode = DATAMatrix({
                    msg :  datastring,
                    dim :   100,
                    pal : ["#000000", "#ffffff"]
                  });
                  
    return {__html: svgNode.outerHTML};
  }
  
  if(!ready) {
    return(
      <div>
      <form onSubmit={(e)=>checkPassword(e)}>
        <input 
          type='text' 
          id='passwordInput'
          autoFocus={true}
          required />
        <button type='submit' className='smallAction clearBlack'>check</button>
        </form>
      </div>
    );
  }
  
  const splitName = user.username.split('.');
	const fineName = splitName[1] ? splitName[0] + " " + splitName[1] : splitName[0];
	
  return(
    <div className='centre space36v'>
      <div className='userCard'>
        <div className='userCardContent'>
          <img src='/neptune-logo-color.svg' />
        
          <n-username class='centreText wordBr cap'>{fineName}</n-username>
        
          <span dangerouslySetInnerHTML={createMarkup()} />
        </div>
        
      </div>
    </div>
  );
};

export default IdCardPanel;