import React, { useState, useEffect } from 'react';
import { 
  VictoryClipContainer,
  VictoryStack,
  VictoryScatter, 
  VictoryBar,
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

const NonConScatterRefs = ({ ncOp, flow, flowAlt, nonCons, app })=> {
  
  const [ series, seriesSet ] = useState([]);
  
    useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    const nonConArray = nonCons || [];
    const nonConArrayClean = nonConArray.filter( x => !x.trash );
    
    function ncCounter(ncArray, ncOptions, appPhases) {
      
      let splitByPhase = [];
      
      const phasesSet = new Set(appPhases);
      [...phasesSet].map( (phase, index)=>{
        let match = ncArray.filter( y => y.where === phase );
        splitByPhase.push({
          'phase': phase,
          'pNC': match,
        });
      });
      let leftover = ncArray.filter( z => phasesSet.has(z.where) === false );
      splitByPhase.unshift({ 'phase': 'other', 'pNC': leftover });
      
      Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(splitByPhase);
      
      let ncCounts = [];
      
      for(let ncSet of splitByPhase) {
        for(let ncType of ncOptions) {
          const typeCount = ncSet.pNC.filter( x => x.type === ncType ).length;
          if(typeCount > 0) {
            ncCounts.push({
              x: typeCount,
              y: ncType,
              l: ncSet.phase,
            });
          }
        }
      }
      return ncCounts;
    }
    
    try{
      const appPhases = app.phases;
      let calc = ncCounter(nonConArrayClean, nonConOptions, appPhases);
      seriesSet( calc );
    }catch(err) {
      console.log(err);
    }
  }, []);

    // Roles.userIsInRole(Meteor.userId(), 'debug') && 
      console.log(series);

  if(!series) {
    return(
      <CalcSpin />
    );
  }

  return(
    <div className='chartNoHeightContain'>
      <p className='centreText'>Defect Type and Reference</p>
  
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 20, right: 20, bottom: 20, left: 100}}
        domainPadding={25}
        height={25 + ( series.length * 15 )}
      >
        <VictoryAxis
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
          labels={(d) => `${d.l} \n ${d.y} \n ${d.x}`}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: '7px' }}
            />}
          style={{
            data: { 
              fill: 'rgba(231,76,60,0.6)',
              stroke: 'rgb(50,50,50)',
              strokeWidth: 1
            },
            labels: { 
              padding: 2,
            } 
          }}
          size={4}
        />
      </VictoryChart>
      
      
    </div>
  );
};

export default NonConScatterRefs;