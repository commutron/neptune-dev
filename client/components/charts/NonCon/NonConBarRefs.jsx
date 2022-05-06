import React, { useState, useEffect } from 'react';
import { 
  VictoryStack,
  VictoryBar,
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import { countMulti } from '/client/utility/Arrays';

const NonConBarRefs = ({ ncOp, nonCons, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ typeNum, typeNumSet ] = useState(null);
  
  useEffect( ()=> {
    const uniqueRefs =  new Set( Array.from(nonCons, x => x.ref) );
    
    const splitByRef = [...uniqueRefs].map( (ref, index)=> {
      let match = nonCons.filter( y => y.ref === ref );
      return{
        'name': ref,
        'ncs': match
      };
    });
    
    const nonConOptions = ncOp || [];
    
    let splitByType = [];
    let typeSet = new Set();
    for(let ref of splitByRef) {
      let type = [];
      for(let n of nonConOptions) {
        const typeCount = countMulti( ref.ncs.filter( x => x.type === n ) );
        if(typeCount > 0) {
          typeSet.add(n);
          type.push({
            x: n,
            y: typeCount,
            l: ref.name,
          });
        }
      }
      splitByType.push(type);
    }
    typeNumSet([...typeSet].length);
    seriesSet( splitByType );
  }, []);

    isDebug && console.log({series, typeNum});

  if(typeNum === null) {
    return(
      <CalcSpin />
    );
  }
  
  return(
    <div className='chartNoHeightContain'>

      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 20, bottom: 20, left: 100}}
        domainPadding={20}
        height={50 + ( typeNum * 15 )}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => Math.round(t)}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryAxis 
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryStack
          theme={Theme.NeptuneVictory}
          colorScale='heatmap'
          horizontal={true}
          padding={0}
        >
        
        {series.map( (entry, index)=>{
          if(entry.length > 0) {
            return(
              <VictoryBar
                key={index+entry.l}
                data={entry}
                labels={(l) => `${l.l}`}
                labelComponent={
                  <VictoryTooltip
                    orientation='top'
                    style={{ fontSize: '7px', padding: 4 }}
                  />}
                barWidth={5}
              />
          )}
        })}
        </VictoryStack>
      </VictoryChart>
      
      
      <p className='centreText small'>Defect Type and Reference</p>
      
    </div>
  );
};

export default NonConBarRefs;