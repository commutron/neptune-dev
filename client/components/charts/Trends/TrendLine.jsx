import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
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

const TrendLine = ({ title, statType, lineColor })=>{
  
  const blank = [ {x:6,y:0},{x:5,y:0},{x:4,y:0},{x:3,y:0},{x:2,y:0},{x:1,y:0} ];
  const [ data, dataSet ] = useState( blank );
  
  useEffect( ()=>{
    const clientTZ = moment.tz.guess();
    Meteor.call('sixWeekRate', clientTZ, statType, (err, re)=>{
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
          tickCount={6}
          tickValues={['-5', '-4', '-3', '-2', '-1', 'now']}
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