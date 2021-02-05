import React from 'react';
// import Pref from '/client/global/pref.js';

import FaradConvert from './FaradConvert';
import OhmConvert from './OhmConvert';
import MilsConvert from './MilsConvert';
import TimeConvert from './TimeConvert';

const CompValuesSlide = ({ 
  view, subLink,
  //batch, batchX, 
  //bCache, pCache, acCache, brCache,
  user, app, // clientTZ,
  //isDebug, isNightly
})=> (
  <div className='space5x5'>
    
    <FaradConvert />
    
    <hr className='dropCeiling overscroll' />
    
    <OhmConvert />
    
    <hr className='dropCeiling overscroll' />
    
    <MilsConvert />
    
    <hr className='dropCeiling overscroll' />
    
    <TimeConvert />
    
  </div>
);

export default CompValuesSlide;

export const FieldObject = ({ titleVal, shortVal, idVal, valueVal, funcVal, factorVal })=> (
  <label className='gap'>{titleVal} <var>({shortVal})</var><br />
    <input
      type='number'
      id={idVal}
      value={valueVal || ''}
      min={0}
      onChange={(e)=>funcVal(e, this[idVal].value, factorVal)}
    />
  </label>
);