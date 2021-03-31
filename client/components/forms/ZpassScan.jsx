import React from 'react';
// import Pref from '/client/global/pref.js';


const ZpassScan = ()=> {
    
	function dThing(input) {
	  const e = input.trim();
    if(e.length > 3) {
      
      const useE = e.split(",");
      let utf8decoder = new TextDecoder();
      let u8arr = new Uint8Array(useE);
      const decode = utf8decoder.decode(u8arr);
  
      
      if(!decode) {
        console.error('bad decode');
      }else{
        
        const cut2 = e.split("<+>");
        const usrnm = cut2[0];
        const psswrd1 = cut2[1];
        
        console.log({usrnm, psswrd1});
      }
    }else{
      console.error('format wrong');
    }
  }
 

  return(
    <div
      className='centre'>
      
      <h2>EXPERIMENT</h2>
      
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