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
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

const NonConBarRefs = ({ ncOp, flow, flowAlt, nonCons, app })=> {
  
  const [ series, seriesSet ] = useState([]);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    const nonConArray = nonCons || [];
    const nonConArrayClean = nonConArray.filter( x => !x.trash );
    
    function ncCounter(ncArray, ncOptions) {
    
      let splitByRef = [];
  
      const uniqueRefs = new Set( Array.from(ncArray, x => x.ref) );
      for(let ref of uniqueRefs) {
        let match = ncArray.filter( y => y.ref === ref );
        splitByRef.push({
          'name': ref,
          'ncs': match
        });
      }
    
      let splitByType = [];
      for(let ref of splitByRef) {
        let type = [];
        for(let n of ncOptions) {
          let typeCount = ref.ncs.filter( x => x.type === n ).length;
          if(typeCount > 0) {
            type.push({
              x: n,
              y: typeCount,
              l: ref.name,
            });
          }
        }
        splitByType.push(type);
      }
      return splitByType;
    }
  
    try{
      let calc = ncCounter(nonConArrayClean, nonConOptions);
      seriesSet( calc );
    }catch(err) {
      console.log(err);
    }
  }, []);

    Roles.userIsInRole(Meteor.userId(), 'debug') && 
      console.log(series);

  if(!series) {
    return(
      <CalcSpin />
    );
  }

  return(
    <div className='chartNoHeightContain'>

      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 20, right: 20, bottom: 20, left: 100}}
        domainPadding={{x: 10, y: 40}}
        height={10 + ( series.length * 5 )}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => Math.round(t)}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fill: 'lightgrey', 
              fontSize: '5px' }
          } }
        />
        <VictoryAxis 
          //fixLabelOverlap={true} 
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fill: 'lightgrey', 
              fontSize: '6px' }
          } }
        />
        <VictoryStack
          theme={Theme.NeptuneVictory}
          colorScale='heatmap'
          horizontal={true}
          padding={0}
          // animate={{
          //   duration: 500,
          //   onLoad: { duration: 250 }
          // }}
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
                    style={{ fontSize: '7px', padding: 2 }}
                  />}
                barWidth={10}
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