import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryAxis, VictoryStack, VictoryArea } from 'victory';
import Theme from '/client/global/themeV.js';

import moment from 'moment';
import 'moment-timezone';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

const ProgLayerBurndown = ({ id, start, floorRelease, end, flowData, itemData, title })=> {
  
  const [ countState, countSet ] = useState( false );
  const [ firstState, firstSet ] = useState( false );
  
  useEffect( ()=> {
    let clientTZ = moment.tz.guess();
    Meteor.call('firstFirst', id, clientTZ, (error, reply)=> {
      error && console.log(error);
      reply && firstSet( reply );
    });
    Meteor.call('layeredHistoryRate', start, end, flowData, itemData, clientTZ, (error, reply)=> {
      error && console.log(error);
      reply && countSet( reply );
    });
  }, []);
  
    
  Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(countState);
  
  const flR = !floorRelease ? null : 
    moment(floorRelease.time);

  if(!countState || !firstState) {
    return(
      <CalcSpin />
    );
  }
   
    
  return(
    <span className='burndownFill centre'>
      <div className='wide balance cap'>
      
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 40, bottom: 25, left: 40}}
          scale={{x: "time", y: "linear"}}
          height={200}
          width={400}
        >
          <VictoryAxis 
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { fill: 'lightgrey', fontSize: '6px' }
            } }
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(l)=> l.toFixed(0,10)}
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { fill: 'lightgrey', fontSize: '4px' }
            } }
          />
          
        <VictoryStack
          theme={Theme.NeptuneVictory}
          padding={0}
        >
        
        {countState.map( (entry, index)=>{
          return(
            <VictoryArea
              key={index+entry.name}
              data={entry.data}
              style={{ 
                data: { 
                  stroke: 'rgb(41, 128, 185)',
                  strokeWidth: '1px',
                  fill: 'rgba(41, 128, 185, 0.2)'
                },
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          )}
        )}
        </VictoryStack>
        
        
        
        </VictoryChart>
        
        <div className='centreText smCap'>{title}</div>
        
      </div>
    </span>
  );
};

export default ProgLayerBurndown;


export const ProgLayerBurndownExplain = ()=>(
  <details className='footnotes'>
    <summary>Chart Details</summary>
    <p className='footnote'>
      The X axis is the number of serialized items remaining.
    </p>
    <p className='footnote'>
      The Y axis starts with the batch creation date and ends with 
      either today or the batch complete day. Weekends are skipped 
      entirely.
    </p>
    <p className='footnote'>
      A step that was added mid-run might not reach zero because 
      finished items would have skipped recording that step.
    </p>
  </details>
);