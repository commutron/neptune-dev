import React, { useState, useEffect } from 'react';
import { FieldObject } from './CompValuesSlide';

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
        
        <FieldObject
          titleVal='Pico'
          shortVal='pF'
          idVal='picoInput'
          valueVal={pico}
          funcVal={changeFarad}
          factorVal={0.000000000001} />
        
        <FieldObject
          titleVal='Nano'
          shortVal='nF'
          idVal='nanoInput'
          valueVal={nano}
          funcVal={changeFarad}
          factorVal={0.000000001} />
        
        <FieldObject
          titleVal='Micro'
          shortVal='µF'
          idVal='microInput'
          valueVal={micro}
          funcVal={changeFarad}
          factorVal={0.000001} />
      
      </div>
      
    </div>
  );
};

export default FaradConvert;