import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';

import ScatterCH from '/client/components/charts/ScatterCH';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';

import { percentOf } from '/client/utility/Convert';


const OnTargetTrend = ({ app, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  
  const [ working, workingSet ] = useState(false);
  
  const [ tgglState, tgglSet ] = useState( false );
  
  const [ fillDT, fillSet ] = useState( blank );
  const [ shipDT, shipSet ] = useState( blank );
  const [ dataQ, dataSetQ ] = useState( blank );
              
  useEffect( ()=>{
    return () => { thingMounted.current = false };
  }, []);
  
  function chartConvert(re) {
    const FasPercent = Array.from(re, w => { 
      const pof = percentOf( (w.y[0] + w.y[1]), w.y[0]);
      const dtp = isNaN(pof) ? null : pof;
      return { x: w.x, y: dtp };
    });
    fillSet(FasPercent);
    
    const SasPercent = Array.from(re, w => { 
      const pof = percentOf( (w.y[2] + w.y[3]), w.y[2]);
      const dtp = isNaN(pof) ? null : pof;
      return { x: w.x, y: dtp };
    });
    shipSet(SasPercent);
    
    const QasPercent = Array.from(re, w => { 
      const pof = percentOf( (w.y[4] + w.y[5]), w.y[4]);
      const dtp = isNaN(pof) ? null : pof;
      return { x: w.x, y: dtp };
    });
    dataSetQ(QasPercent);
    
    workingSet(false);
  }
  
  function runLoopLite(cName, tspan) {
    workingSet(true);
    
    const backDate = isDebug ? app.createdAt : app.tideWall;
    const dur = moment.duration(moment().diff(moment(backDate)));
    const durCln = tspan == 'month' ?
                    parseInt( dur.asMonths(), 10 ) :
                    parseInt( dur.asWeeks(), 10 );
                    
    Meteor.call('cycleLiteRate', cName, durCln, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(re);
          chartConvert(re);
        }
      }
    });
  }
  
  return(
    <div>
       
      <div className='rowWrap noPrint'>
        {working ?
          <b><i className='fas fa-spinner fa-lg fa-spin'></i></b> :
          <i><i className='fas fa-spinner fa-lg'></i></i>
        }
        
        <button
          className='smallAction blackHover gap'
          onClick={()=>runLoopLite('doneBatchLiteMonths', 'month')}
          disabled={working}
        >By Month</button>
        
        <button
          className='smallAction blackHover gap'
          onClick={()=>runLoopLite('doneBatchLiteWeeks', 'week')}
          disabled={working}
        >By Week</button>
        
        <span className='flexSpace' />
        
        <ToggleSwitch 
          tggID='shipfilltrnd'
          toggleLeft='ship'
          toggleRight='fulfill'
          toggleVal={tgglState}
          toggleSet={tgglSet}
        />
      </div>
      
      <ScatterCH
        multidata={[
          tgglState ?
          { data_name: 'fulfill on time',data_array: fillDT, data_color: "rgb(39, 174, 96)" }
          :
          { data_name: 'ship on time',data_array: shipDT, data_color: "rgb(46, 204, 113)" },
          { data_name: 'finish on quote',data_array: dataQ, data_color: "rgb(142, 68, 173)" }
        ]}
        title='On Target Percent KPI'
      />

    </div>
  );
};

export default OnTargetTrend;