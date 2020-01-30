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
    <div className='chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 20, bottom: 20, left: 50}}
        domainPadding={20}
        scale={{x: "time", y: "linear"}}
        height={200}
      >
        <VictoryAxis 
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { fill: 'lightgrey', fontSize: '7px' }
          } }
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(l)=> l.toFixed(0,10)}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { fill: 'lightgrey', fontSize: '7px' }
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
          // animate={{
          //   duration: 2000,
          //   onLoad: { duration: 1000 }
          // }}
        />
      </VictoryChart>
      
      <p className='centreText small cap'>{title}</p>
      
    </div>
  );
};

export default NonConRate;