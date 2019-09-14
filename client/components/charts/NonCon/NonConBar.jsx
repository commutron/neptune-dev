import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
  VictoryStack
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NonConBar = ({ ncOp, flow, flowAlt, nonCons, app })=> {
  
  const [ series, seriesSet ] = useState([ [] ]);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    const nonConArray = nonCons || [];
    const nonConArrayClean = nonConArray.filter( x => !x.trash );
    
    function ncCounter(ncArray, ncOptions, appPhases) {
      
      let splitByPhase = [];
      
      const phasesSet = new Set(appPhases);
      for(let phase of phasesSet) {
        let match = ncArray.filter( y => y.where === phase );
        splitByPhase.push({
          'phase': phase,
          'pNC': match
        });
      }
      let leftover = ncArray.filter( z => phasesSet.has(z.where) === false );
      splitByPhase.unshift({ 'phase': 'other', 'pNC': leftover });
      
      Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(splitByPhase);
      
      let ncCounts = [];
      
      for(let ncSet of splitByPhase) {
        let ncPhase = [];
        for(let ncType of ncOptions) {
          const typeCount = ncSet.pNC.filter( x => x.type === ncType ).length;
          if(typeCount > 0) {
            ncPhase.push({
              y: typeCount,
              x: ncType,
              label: ncSet.phase
            });
          }
        }
        ncCounts.push(ncPhase);
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
    <div className='invert chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 20, right: 50, bottom: 20, left: 120}}
        domainPadding={{x: 10, y: 40}}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => Math.round(t)}
          style={ {
            // axis: { stroke: 'grey' },
            // grid: { stroke: '#5c5c5c' },
            // ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              // fill: 'lightgrey', 
              fontSize: '8px' }
          } }
        />
        <VictoryAxis 
          //fixLabelOverlap={true} 
          style={ {
            // axis: { stroke: 'grey' },
            // grid: { stroke: '#5c5c5c' },
            // ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              // fill: 'lightgrey', 
              fontSize: '8px' }
          } }
        />
        <VictoryStack
          theme={Theme.NeptuneVictory}
          colorScale={[
            "rgb(52, 152, 219)", 
            "rgb(149, 165, 166)", 
            "rgb(241, 196, 15)"
          ]}
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
                key={index}
                horizontal={true}
                data={entry}
                labels={(d) => `${d.label}`}
                labelComponent={
                  <VictoryTooltip />}
              />
          )}
        })}
        </VictoryStack>
      </VictoryChart>
    </div>
  );
};

export default NonConBar;