import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';
import { 
  VictoryLine,
  VictoryChart, 
  VictoryAxis
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

// import ToggleBar from '/client/components/bigUi/ToolBar/ToggleBar';
// <ToggleBar
//         toggleOptions={['hours', 'minutes', 'percent']}
//         toggleVal={conversion}
//         toggleSet={(e)=>conversionSet(e)}
//       />
import { percentOf } from '/client/utility/Convert';


const MonthTrend = ({ app, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];

  const [ data, dataSet ] = useState( blank );
              
  useEffect( ()=>{

    Meteor.call('cycleWeekRate', 'doneBatch', 24, 'month', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(re);

          const asPercent = Array.from(re, w => { 
            const pof = percentOf( (w.y[0] + w.y[1]), w.y[0]);
            const np = isNaN(pof) ? 0 : pof;
            return { x: w.x, y: np } } );
          dataSet(asPercent);
        }
      }
    });
    return () => { thingMounted.current = false };
  }, []);
  
  
  // console.log(data);
  
  return(
    <div>
      
      <h3 className='orangeBorder'>PROTOTYPE</h3>
      
      <div className=''>
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 25, bottom: 25, left: 25}}
          domainPadding={{x: 10, y: 40}}
          height={300}
        >
          <VictoryAxis
            dependentAxis
            tickValues={[10,20,30,40,50,60,70,80,90,100]}
          />
          <VictoryAxis
            tickCount={data.length}
            tickFormat={(t) => `-${24-t}`}
          />
          
            <VictoryLine
              data={data}
              style={{ data: { stroke: 'black' } }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
          
      </div>
    
    
    </div>
  );
};

export default MonthTrend;