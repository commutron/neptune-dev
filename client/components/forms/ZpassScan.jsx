import React from 'react';
// import Pref from '/client/global/pref.js';


const ZpassScan = ()=> {
  
	function eThing(e) {
    
    var encodedData = window.btoa( e );
    
    console.log('§'+encodedData+'§');
    
    // user.name¶p@ssW0rD¶p@ssW0rD
    
    // §dXNlci5uYW1ltnBAc3NXMHJEtnBAc3NXMHJE§
    
    // malcolm.reynolds¶malmal¶malmal
    // §bWFsY29sbS5yZXlub2xkc7ZtYWxtYWy2bWFsbWFs§
  }
  
  
	function dThing(e) {
    if(e.length > 3) {
      const properEnd = e.charAt(0) === "\u00A7" &&
                        e.charAt(e.length - 1) === "\u00A7";
      const clean = e.substring(1, e.length - 1);                   
      if(!properEnd) {
        console.error('no end key');
      }else{                    
        let decode = window.atob( clean );
        if(!decode) {
          console.error('bad decode');
        }else{
        
          console.log(decode);
          
          const split = decode.split("\u00B6");
          const usrnm = split[0];
          const psswrd1 = split[1];
          const psswrd2 = split[2];
          
          console.log({usrnm, psswrd1, psswrd2});
      
        }
      }
    }
  }
  
 

  return(
    <div
      className='centre'>
      
      <h2>EXPERIMENT</h2>
      
      <br />
      <p>
        <textarea
          id='xxZencode'
          cols='30'
          rows='5'
          onInput={(e)=>eThing(e.target.value)}
          placeholder='encode'
          autoFocus={true}></textarea>
      </p>
      
      <br />
      <p>
        <textarea
          id='xxZdecode'
          cols='30'
          rows='5'
          onInput={(e)=>dThing(e.target.value)}
          placeholder='decode'></textarea>
      </p>
      
    </div>
  );
};

export default ZpassScan;