import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';


// Not In Use
//// Keeping as example

// OUT OF DATE -- Uses Phases

const NonConScatter = ({ ncOp, flow, flowAlt, nonCons, app })=> {
  
  const [ series, seriesSet ] = useState([]);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    const nonConArray = nonCons || [];
    const nonConArrayClean = nonConArray.filter( x => !x.trash );
    
    function ncCounter(ncArray, ncOptions, appPhases) {
      
      let splitByPhase = [];
      const symOp = ["square", "triangleUp", "triangleDown", "diamond", "plus", "minus", "star"];
      
      const phasesSet = new Set(appPhases);
      [...phasesSet].map( (phase, index)=>{
        let match = ncArray.filter( y => y.where === phase );
        splitByPhase.push({
          'phase': phase,
          'pNC': match,
          'sym': symOp[index] || "circle"
        });
      });
      let leftover = ncArray.filter( z => phasesSet.has(z.where) === false );
      splitByPhase.unshift({ 'phase': 'other', 'pNC': leftover, 'sym': "circle" });
      
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
              symbol: ncSet.sym
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
          
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && 
      console.log(series);
  
  return(
    <div className='chartNoHeightContain'>
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
              fontSize: '7px' }
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
              fontSize: '7px' }
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

export default NonConScatter;