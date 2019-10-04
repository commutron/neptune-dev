import React from "react";
// import ReactDOM from 'react-dom';
import { VictoryBar, VictoryStack } from 'victory';

const TimeBudgetBar = ({ title, a, b, c})=> {
  
  const B = a === 0 && b === 0 && c === 0 ? 1 : b;
  
  return(
    <div className='invert' className='noCopy' title={title}>
    
      <VictoryStack
        colorScale={["rgb(52, 152, 219)", "rgb(149, 165, 166)", "rgb(241, 196, 15)"]}
        horizontal={true}
        padding={0}
        height={45}
        animate={{
          duration: 500,
          onLoad: { duration: 250 }
        }}
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
    </div>
  );
};
  
export default TimeBudgetBar;