import React, { useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';


const MilsConvert = ({ 
  view, subLink,
  //batch, batchX, 
  //bCache, pCache, acCache, brCache,
  user, app, // clientTZ,
  //isDebug, isNightly
})=> {
  
  const [ metricMM, metricMMSet ] = useState(null);
  
  const [ mm, mmSet ] = useState(null);
  const [ mil, milSet ] = useState(null);
  const [ inch, inchSet ] = useState(null);
  
  function changeMetric(e, val, factor) {
    const toMetric = Number(val) * Number(factor);
    metricMMSet(toMetric);
  }
  
  useEffect( ()=> {
    !metricMM ? '' : mmSet( (metricMM).toPrecision(10) / 1 );
    !metricMM ? '' : milSet( (metricMM / 0.0254 ).toPrecision(10) / 1 );
    !metricMM ? '' : inchSet( (metricMM / 25.4 ).toPrecision(10) / 1 );
  }, [metricMM]);
  
  
  return(
    <div>
      <h2>XY Metric v Imperial</h2>
      
      <div className='rowWrap'>
        
        <label className='gap'>Millimeter <var>(mm)</var><br />
          <input
            type='number'
            id='mmInput'
            value={mm}
            onChange={(e)=>changeMetric(e, this.mmInput.value, 1)}
          />
        </label>
        
        <label className='gap'>Mil <var>(1/1000")</var><br />
          <input
            type='number'
            id='milInput'
            value={mil}
            onChange={(e)=>changeMetric(e, this.milInput.value, 0.0254 )}
          />
        </label>
        
        <label className='gap'>Inch <var>(1")</var><br />
          <input
            type='number'
            id='inchInput'
            value={inch}
            onChange={(e)=>changeMetric(e, this.inchInput.value, 25.4 )}
          />
        </label>
        
      </div>
      
    </div>
  );
};

export default MilsConvert;