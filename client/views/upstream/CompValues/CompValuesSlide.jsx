import React from 'react';
// import Pref from '/client/global/pref.js';

import FaradConvert from './FaradConvert';
import OhmConvert from './OhmConvert';
import MilsConvert from './MilsConvert';


const CompValuesSlide = ({ 
  view, subLink,
  //batch, batchX, 
  //bCache, pCache, acCache, brCache,
  user, app, // clientTZ,
  //isDebug, isNightly
})=> {
  
 
  
  return(
    <div className='space5x5'>
      
      <FaradConvert />
      
      <hr className='dropCeiling overscroll' />
      
      <OhmConvert />
      
      <hr className='dropCeiling overscroll' />
      
      <MilsConvert />
      
    </div>
  );
};

export default CompValuesSlide;