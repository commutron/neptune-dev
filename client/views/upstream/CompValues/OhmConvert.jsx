import React, { useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
import { FieldObject } from './CompValuesSlide';

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
        <FieldObject
          titleVal='Mili'
          shortVal='mΩ'
          idVal='miliInput'
          valueVal={mili}
          funcVal={changeOhm}
          factorVal={0.001} />
        */}
        <FieldObject
          titleVal='Ohm'
          shortVal='Ω'
          idVal='ohmInput'
          valueVal={ohm}
          funcVal={changeOhm}
          factorVal={1} />
        
        <FieldObject
          titleVal='Kilo'
          shortVal='kΩ'
          idVal='kiloInput'
          valueVal={kilo}
          funcVal={changeOhm}
          factorVal={1000} />
        
        <FieldObject
          titleVal='Mega'
          shortVal='MΩ'
          idVal='megaInput'
          valueVal={mega}
          funcVal={changeOhm}
          factorVal={1000000} />

      </div>
      
    </div>
  );
};

export default OhmConvert;