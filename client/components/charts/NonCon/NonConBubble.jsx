import React, { useState, useEffect } from "react";
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip,
  VictoryClipContainer
} from 'victory';
// import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import { countMulti } from '/client/utility/Arrays';

const NonConBubble = ({ ncOp, nonCons, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ typeNum, typeNumSet ] = useState(1);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    const splitByWhere = [...new Set( Array.from(nonCons, n => n.where ) ) ];
   
    const splitOut = splitByWhere.map( (where, index)=> {
      let match = nonCons.filter( y => y.where === where );
      return{
        'where': where,
        'pNC': match
      };
    });
      
    isDebug && console.log(splitOut);
      
    let ncCounts = [];
    let typeSet = new Set();
    
    for(let ncSet of splitOut) {
      for(let ncType of nonConOptions) {
        const typeCount = countMulti( ncSet.pNC.filter( x => x.type === ncType ) );
        if(typeCount > 0) {
          typeSet.add(ncType);
          ncCounts.push({
            x: ncSet.where,
            y: ncType,
            z: typeCount
          });
        }
      }
    }
    
    typeNumSet(typeSet.size);
      
    seriesSet(ncCounts);
    
  }, []);
          

  isDebug && console.log({series, typeNum});
    
  return(
    <div className='chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 20, bottom: 20, left: 100}}
        domainPadding={20}
        height={50 + ( typeNum * 15 )}
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
          bubbleProperty="z"
          minBubbleSize={3}  
          maxBubbleSize={20}
          labels={(d) => `Quantity: ${d.z}`}
          labelComponent={
            <VictoryTooltip 
              style={{ fontSize: '7px' }}
            />}
          groupComponent={<VictoryClipContainer/>}
          style={ {
            data: { 
              fill: 'rgba(231,76,60,0.6)',
              stroke: 'rgb(50,50,50)',
              strokeWidth: 1
          } } }
        />
      </VictoryChart>
      
      <p className='centreText small cap'>Defect Type and Recorded Location as Bubbles</p>
      
    </div>
  );
};

export default NonConBubble;