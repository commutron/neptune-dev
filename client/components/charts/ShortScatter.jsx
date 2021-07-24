import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis,
  VictoryClipContainer
} from 'victory';
import Theme from '/client/global/themeV.js';

const ShortScatter = ({ shortfalls, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ yNum, ySet ] = useState(1);
  
  useEffect( ()=> {
    const partNums = [...new Set(Array.from(shortfalls, x=> x.partNum))];
    ySet(partNums.length);
    
    let shCounts = [];
   
    for(let sh of shortfalls) {
      for(let ref of sh.refs) {
        shCounts.push({
          x: ref,
          y: sh.partNum,
          symbol: "triangleUp",
          size: 5
        });
      }
    }
    seriesSet(shCounts);
    
  }, []);
          

  isDebug && console.log({series, yNum});
    
  return(
    <div className='chartNoHeightContain up'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 20, bottom: 20, left: 100}}
        domainPadding={20}
        height={50 + ( yNum * 15 )}
      >
        <VictoryAxis
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryAxis 
          dependentAxis
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryScatter
          data={series}
          groupComponent={<VictoryClipContainer/>}
          style={ {
            data: { 
              fill: 'rgba(243,156,18,0.2)',
              stroke: 'rgb(50,50,50)',
              strokeWidth: 0.5,
          } } }
        />
      </VictoryChart>
      
      <p className='centreText small cap'>Short Parts and Referances</p>
      
    </div>
  );
};

export default ShortScatter;