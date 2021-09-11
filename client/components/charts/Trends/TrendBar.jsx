import { Meteor } from 'meteor/meteor';
import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';
import { 
  VictoryBar,
  VictoryChart, 
  VictoryAxis,
  VictoryStack
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

// statType // doneBatch'

const TrendBar = ({ title, statType, cycleCount, cycleBracket, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  // const blank = Array(cycleCount);
  const [ dataG, dataGSet ] = useState( blank );
  const [ dataNG, dataNGSet ] = useState( blank );
  
  useEffect( ()=>{
    Meteor.call('cycleWeekRate', statType, cycleCount, cycleBracket, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(`${title}: ${JSON.stringify(re)}`);
          const barOne = Array.from(re, w => { return { x: w.x, y: w.y[0] } } );
          const barTwo = Array.from(re, w => { return { x: w.x, y: w.y[1] } } );
          dataGSet(barOne);
          dataNGSet(barTwo);
        }
      }
    });
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <TrendBarChart
      dataG={dataG}
      dataNG={dataNG}
      cycleCount={cycleCount}
      title={title} />
  );
};

export default TrendBar;

export const TrendBarCache = ({ title, statType, cycleCount, cycleBracket, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  const [ dataG, dataGSet ] = useState( blank );
  const [ dataNG, dataNGSet ] = useState( blank );
  
  useEffect( ()=>{
    Meteor.call('cycleLiteRate', statType, cycleCount, (err, re)=>{
      err && console.log(err);
      if(re && re.length > 0) {
        if(thingMounted.current) {
          isDebug && console.log(`${title}: ${JSON.stringify(re)}`);
          const barOne = Array.from(re, w => { return { x: w.x, y: w.y[0] } } );
          const barTwo = Array.from(re, w => { return { x: w.x, y: w.y[1] } } );
          dataGSet(barOne);
          dataNGSet(barTwo);
        }
      }
    });
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <TrendBarChart
      dataG={dataG}
      dataNG={dataNG}
      cycleCount={cycleCount}
      title={title} />
  );
};

const TrendBarChart = ({ dataG, dataNG, cycleCount, title })=> (
  <div className='chart20Contain'>
    <VictoryChart
      theme={Theme.NeptuneVictory}
      padding={{top: 25, right: 25, bottom: 25, left: 25}}
      domainPadding={{x: 10, y: 40}}
      height={400}
    >
      <VictoryAxis 
        tickCount={dataG.length}
        tickFormat={(t) => isNaN(cycleCount-t) ? '*' : `-${cycleCount-t}`}
      />
      <VictoryStack
        theme={Theme.NeptuneVictory}
          colorScale={["rgb(46, 204, 113)", "rgb(241, 196, 15)"]}
          padding={0}
          animate={{
            duration: 500,
            onLoad: { duration: 500 }
          }}
        >
        <VictoryBar
          data={dataG}
          barRatio={0.9}
        />
        <VictoryBar
          data={dataNG}
          barRatio={0.9}
        />
      </VictoryStack>
    </VictoryChart>
    <div className='centreText smCap'>{title}</div>
  </div>
);