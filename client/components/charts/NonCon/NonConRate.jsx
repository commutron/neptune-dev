import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';
import Theme from '/client/global/themeV.js';

const NonConRate = ({ batches, title, lineColor })=> {
  
  const [ ratesC, setCount ] = useState( false );
  
  useEffect( ()=>{
    Meteor.call('nonConRateLoop', batches, (error, reply)=>{
      error && console.log(error);
      reply && setCount( reply.flat() );
    });
  }, [batches]);

  if(!ratesC) {
    return(
      <CalcSpin />
    );
  }
  
  return(
    <span>
      <div>
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 40, bottom: 25, left: 40}}
          scale={{x: "time", y: "linear"}}
          height={400}
        >
          <VictoryAxis 
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { fill: 'lightgrey', fontSize: '12px' }
            } }
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(l)=> l.toFixed(0,10)}
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { fill: 'lightgrey', fontSize: '12px' }
            } }
          />
          
          <VictoryLine
            data={ratesC}
            style={{ 
              data: { 
                stroke: lineColor || 'black',
                strokeWidth: '2px'
              },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
          />
        </VictoryChart>
        
        <div className='centreText smCap'>{title}</div>
        
      </div>
    </span>
  );
};

export default NonConRate;