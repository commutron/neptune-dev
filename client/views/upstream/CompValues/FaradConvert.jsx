import React, { useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';

const FaradConvert = ()=> {
  
  const [ farad, faradSet ] = useState(null);
  
  const [ pico, picoSet ] = useState(null);
  const [ nano, nanoSet ] = useState(null);
  const [ micro, microSet ] = useState(null);
  
  function changeFarad(e, val, factor) {
    const toFarad = Number(val) * Number(factor);
    faradSet(toFarad);
  }
  
  useEffect( ()=> {
    !farad ? '' : picoSet( (farad * 1000000000000).toPrecision(10) / 1 );
    !farad ? '' : nanoSet( (farad * 1000000000).toPrecision(10) / 1 );
    !farad ? '' : microSet( (farad * 1000000).toPrecision(10) / 1 );
    
  }, [farad]);
  
  return(
    <div>
      <h2>Capacitor Farads</h2>
      
      <div className='rowWrap'>
      
        <label className='gap'>Pico <var>(pF)</var><br />
          <input
            type='number'
            id='picoInput'
            value={pico}
            onInput={(e)=>changeFarad(e, this.picoInput.value, 0.000000000001)}
          />
        </label>
        
         <label className='gap'>Nano <var>(nF)</var><br />
          <input
            type='number'
            id='nanoInput'
            value={nano}
            onInput={(e)=>changeFarad(e, this.nanoInput.value, 0.000000001)}
          />
        </label>
        
         <label className='gap'>Micro <var>(µF)</var><br />
          <input
            type='number'
            id='microInput'
            value={micro}
            onInput={(e)=>changeFarad(e, this.microInput.value, 0.000001)}
          />
        </label>
      
      </div>
      
    </div>
  );
};

export default FaradConvert;