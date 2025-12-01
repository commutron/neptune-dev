import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FieldObject } from './CompValuesSlide';
import { ms2sc, ms2mn, ms2hr } from '/client/utility/Convert';

const TimeConvert = ()=> {

  const [ baseMS, baseMSSet ] = useState(null);
  
  const [ sec, secSet ] = useState(null);
  const [ min, minSet ] = useState(null);
  const [ hr, hrSet ] = useState(null);
  
  function baseUnit(e, val, unit) {
    const toMS = moment.duration(val, unit).asMilliseconds();
    baseMSSet(toMS);
  }
  
  useEffect( ()=> {
    !baseMS ? '' : secSet( ms2sc(baseMS) );
    !baseMS ? '' : minSet( ms2mn(baseMS) );
    !baseMS ? '' : hrSet( ms2hr(baseMS) );
  }, [baseMS]);
  
  return(
    <div>
      <h2>Time Duration</h2>
      
      <div className='rowWrap'>
        
        <FieldObject
          titleVal='Seconds'
          shortVal='sec'
          idVal='secInput'
          valueVal={sec}
          funcVal={baseUnit}
          factorVal="seconds" />
        
        <FieldObject
          titleVal='Minutes'
          shortVal='min'
          idVal='minInput'
          valueVal={min}
          funcVal={baseUnit}
          factorVal="minutes" />
        
        <FieldObject
          titleVal='Hours'
          shortVal='hr'
          idVal='hrInput'
          valueVal={hr}
          funcVal={baseUnit}
          factorVal="hours" />
        
      </div>
      
    </div>
  );
};

export default TimeConvert;