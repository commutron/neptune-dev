import React, { useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';

const OhmConvert = ()=> {
  
  const [ standardOhm, standardOhmSet ] = useState(null);
  
  //const [ mili, miliSet ] = useState(null);
  const [ ohm, ohmSet ] = useState(null);
  const [ kilo, kiloSet ] = useState(null);
  const [ mega, megaSet ] = useState(null);
  
  function changeOhm(e, val, factor) {
    const toOhm = Number(val) * Number(factor);
    standardOhmSet(toOhm);
  }
  
  useEffect( ()=> {
    //!standardOhm ? '' : miliSet( (standardOhm * 1000).toPrecision(10) / 1 );
    !standardOhm ? '' : ohmSet( (standardOhm * 1).toPrecision(10) / 1 );
    !standardOhm ? '' : kiloSet( (standardOhm * 0.001).toPrecision(10) / 1 );
    !standardOhm ? '' : megaSet( (standardOhm * 0.000001).toPrecision(10) / 1 );
  }, [standardOhm]);
  
  
  return(
    <div>
      <h2>Resistor Ohms</h2>
      
      <div className='rowWrap'>
      
        {/*
        <label className='gap'>Mili <var>(mΩ)</var><br />
          <input
            type='number'
            id='miliInput'
            value={mili}
            onInput={(e)=>changeOhm(e, this.miliInput.value, 0.001)}
          />
        </label>
        */}
        
        <label className='gap'>Ohm <var>(Ω)</var><br />
          <input
            type='number'
            id='ohmInput'
            value={ohm}
            onInput={(e)=>changeOhm(e, this.ohmInput.value, 1)}
          />
        </label>
        
        <label className='gap'>Kilo <var>(kΩ)</var><br />
          <input
            type='number'
            id='kiloInput'
            value={kilo}
            onInput={(e)=>changeOhm(e, this.kiloInput.value, 1000)}
          />
        </label>
        
        <label className='gap'>Mega <var>(MΩ)</var><br />
          <input
            type='number'
            id='megaInput'
            value={mega}
            onInput={(e)=>changeOhm(e, this.megaInput.value, 1000000)}
          />
        </label>
      </div>
      
    </div>
  );
};

export default OhmConvert;