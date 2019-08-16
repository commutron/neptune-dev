import React from "react";
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryStack } from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const TimeBudgetBar = ({ title, a, b, c})=> {
  
  const B = a === 0 && b === 0 && c === 0 ? 1 : b;
  
  return(
    <div className='invert' className='noCopy' title={title}>
    
      <VictoryStack
        theme={Theme.NeptuneVictory}
        colorScale={["rgb(52, 152, 219)", "rgb(149, 165, 166)", "rgb(241, 196, 15)"]}
        horizontal={true}
        padding={0}
        height={45}
      >
        <VictoryBar 
          data={[{x: "a", y: a}]}
          barWidth={40}
        />
        <VictoryBar
          data={[{x: "a", y: B} ]}
          barWidth={40}
        />
        <VictoryBar
          data={[{x: "a", y: c} ]}
          barWidth={40}
        />
      </VictoryStack>


{/*
      <div className='pieRing'>
        <VictoryPie
          theme={Theme.NeptuneVictory}
          colorScale={colours}
          padAngle={3}
          padding={0}
          innerRadius={160}
          data={nums}
          labels={(l)=>null}
        />
        <span className='pieCore numFont'>{total}</span> 
      </div>
      */}
    </div>
  );
};
  
export default TimeBudgetBar;