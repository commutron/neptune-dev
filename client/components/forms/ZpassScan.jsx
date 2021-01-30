import React from 'react';
// import Pref from '/client/global/pref.js';


const ZpassScan = ()=> {
  
  // const rndmKey = Math.random().toString(36).substr(2, 5);
  
	function eThing(e) {
    
    var encodedData = window.btoa(e);
    
    console.log(encodedData);
    
    // §user.name¶p@ssW0rD¶p@ssW0rD¶p@ssW0rD§
    
    // p3VzZXIubmFtZbZwQHNzVzByRLZwQHNzVzByRLZwQHNzVzByRKc
  }
  
  
	function dThing(e) {
    if(e.length > 3) {
      var decode = window.atob(e);
      if(!decode) {
        console.error('bad decode');
      }else{
        
        console.log(decode);
        
        const properEnd = decode.charAt(0) === "\u00A7" &&
                          decode.charAt(decode.length - 1) === "\u00A7";
        
        if(!properEnd) {
          console.error('no end key');
        }else{
          
          const clean = decode.substring(1, decode.length - 1);
          
          const split = clean.split("\u00B6");
          const usrnm = split[0];
          const psswrd1 = split[1];
          const psswrd2 = split[2];
          const psswrd3 = split[3];
          
          console.log({usrnm, psswrd1, psswrd2, psswrd3});
      
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