import React from 'react';
// import Pref from '/client/global/pref.js';


const ZpassScan = ()=> {
  
	function eThing(e) {
    
    var encodedData = window.btoa( e );
    
    console.log('§'+encodedData+'§');
    
    // user.name¶p@ssW0rD
    // §dXNlci5uYW1ltnBAc3NXMHJE§
    
    // malcolm.reynolds¶malmal
    // §bWFsY29sbS5yZXlub2xkc7ZtYWxtYWw=§
  }
  
  
	function dThing(input) {
	  const e = input.trim();
    if(e.length > 3) {
   
      const strt = e.indexOf("\u00A7");
      const endng = e.indexOf("\u00A7", (strt+1));
      
      if(strt >= 0 && endng > 0) {
        
        let clean = e.substring(strt+1, endng); 
        console.log(clean);
        
        let decode = window.atob( clean );
        if(!decode) {
          console.error('bad decode');
        }else{
        
          console.log(decode);
          
          const split = decode.split("\u00B6");
          const usrnm = split[0];
          const psswrd1 = split[1];
          
          console.log({usrnm, psswrd1});
      
        }
      }else{
        console.error('fromat wrong');
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