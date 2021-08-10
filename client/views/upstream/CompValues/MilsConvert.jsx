import React, { useState, useEffect } from 'react';
import { FieldObject } from './CompValuesSlide';

const MilsConvert = ()=> {
  
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
        
        <FieldObject
          titleVal='Millimeter'
          shortVal='mm'
          idVal='mmInput'
          valueVal={mm}
          funcVal={changeMetric}
          factorVal={1} />
          
        <FieldObject
          titleVal='Mil'
          shortVal='1/1000"'
          idVal='milInput'
          valueVal={mil}
          funcVal={changeMetric}
          factorVal={0.0254} />
          
        <FieldObject
          titleVal='Inch'
          shortVal='1"'
          idVal='inchInput'
          valueVal={inch}
          funcVal={changeMetric}
          factorVal={25.4} />
      </div>
      
    </div>
  );
};

export default MilsConvert;