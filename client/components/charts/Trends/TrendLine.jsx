import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
import moment from 'moment';
import 'moment-timezone';
import { 
  VictoryLine, 
  VictoryChart, 
  VictoryAxis,
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

// statType // 'newBatch', 'doneBatch', 'newNC', 'newSH'

const TrendLine = ({ title, statType, cycleCount, cycleBracket, lineColor })=>{
  
  const blank =  [ {x:1,y:0} ];
  //const blank = Array(cycleCount);
  const [ data, dataSet ] = useState( blank );
  
  useEffect( ()=>{
    const clientTZ = moment.tz.guess();
    Meteor.call('cycleWeekRate', clientTZ, statType, cycleCount, cycleBracket, (err, re)=>{
      err && console.log(err);
      re && dataSet(re);
    });
  }, []);
  
  return(
    <div className='chart20Contain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 25, right: 25, bottom: 25, left: 25}}
        domainPadding={{x: 10, y: 40}}
        height={400}
      >
        <VictoryAxis
          tickCount={data.length}
          tickFormat={(t) => `-${cycleCount-t}`}
          //tickValues={Array.from(data, z => '')}
        />
          <VictoryLine
            data={data}
            style={{ data: { stroke: lineColor || 'black' } }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
          />
        </VictoryChart>
        <div className='centreText smCap'>{title}</div>
      </div>
  );
};

export default TrendLine;