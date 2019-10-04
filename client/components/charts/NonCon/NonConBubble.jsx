import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip,
  VictoryClipContainer
} from 'victory';
import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NonConBubble = ({ ncOp, nonCons, app })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ typeNum, typeNumSet ] = useState(1);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    function ncCounter(ncArray, ncOptions, appPhases) {
    
      const phasesSet = new Set(appPhases);
      
      const splitByPhase = [...phasesSet].map( (phase, index)=> {
        let match = ncArray.filter( y => y.where === phase );
        return{
          'phase': phase,
          'pNC': match
        };
      });
      let leftover = ncArray.filter( z => phasesSet.has(z.where) === false );
      splitByPhase.unshift({ 'phase': 'other', 'pNC': leftover });
      
      Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(splitByPhase);
      
      let ncCounts = [];
      let typeSet = new Set();
      for(let ncSet of splitByPhase) {
        for(let ncType of ncOptions) {
          const typeCount = ncSet.pNC.filter( x => x.type === ncType ).length;
          if(typeCount > 0) {
            typeSet.add(ncType);
            ncCounts.push({
              x: ncSet.phase,
              y: ncType,
              z: typeCount
            });
          }
        }
      }
      typeNumSet([...typeSet].length);
      return ncCounts;
    }
    
    try{
      const appPhases = app.phases;
      let calc = ncCounter(nonCons, nonConOptions, appPhases);
      seriesSet(calc);
    }catch(err) {
      console.log(err);
    }
  }, []);
          

    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({series, typeNum});
    
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
              fill: 'lightgrey', 
              fontSize: '6px' }
          } }
        />
        <VictoryAxis 
          dependentAxis
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
        <VictoryScatter
          data={series}
          bubbleProperty="z"
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
      
      <p className='centreText small cap'>Defect Type and {Pref.phase} as Buubles</p>
      
    </div>
  );
};

export default NonConBubble;