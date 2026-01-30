import React, { useState, useEffect, useRef } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import Pref from '/client/global/pref.js';

import { NonConBarCH } from '/client/components/charts/NonCon/NonConBar';


const WidgetMultiBatchBar = ({ fetchFunc, widgetId, title, color })=> {
  
  const mounted = useRef(true);
  
  const [ seriesState, seriesSet ] = useState( false );
  const [ labelsState, labelsSet ] = useState( false );
  
  useEffect( ()=> {
    Meteor.call(fetchFunc, widgetId, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        if(mounted.current) {
          labelsSet( reply[1] );
          const frmt = reply[0].map( (re, index) => { 
            const clrshift = color + " " + (index*10) + "%)";
            return {
              label: re.name,
              data: re.data,
              backgroundColor: clrshift,
              stack: 'stk'
          }});
          seriesSet(frmt);
        }
      }
    });
    
    return () => { mounted.current = false; };
  }, []);

  if(!seriesState) {
    return(
      <CalcSpin />
    );
  }
  
  if(seriesState.length > 0) {
    return(
      <NonConBarCH
        series={seriesState}
        types={labelsState}
        title={title}
      />
    );
  }
  
  return(
    <div className='centreText fade'>
      <i className='fas fa-ghost fa-2x grayT'></i>
      <p className='medBig cap'>no {Pref.xBatchs}</p>
    </div>
  );
};

export default WidgetMultiBatchBar;