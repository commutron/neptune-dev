import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip,
  VictoryStack
} from 'victory';
import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NonConBar = ({ ncOp, nonCons, app })=> {
  
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
      let leftover = ncArray.filter( z => phasesSet.has(z.where) === false ) || [];
      splitByPhase.unshift({ 'phase': 'other', 'pNC': leftover });
      
      
      Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(splitByPhase);

      let ncCounts = [];
      let typeSet = new Set();
      for(let ncSet of splitByPhase) {
        let ncPhase = [];
        for(let ncType of ncOptions) {
          const typeCount = ncSet.pNC.filter( x => x.type === ncType ).length || 0;
          if(typeCount > 0) {
            typeSet.add(ncType);
            ncPhase.push({
              y: typeCount,
              x: ncType,
              label: ncSet.phase
            });
          }
        }
        ncCounts.push(ncPhase);
      }
      typeNumSet([...typeSet].length);
      return ncCounts;
    }
    
    try{
      const appPhases = app.phases;
      let calc = ncCounter(nonCons, nonConOptions, appPhases);
      seriesSet( calc );
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
                key={index+entry.label}
                data={entry}
                labels={(l) => `${l.label}`}
                labelComponent={
                  <VictoryTooltip
                    orientation='top'
                    style={{ fontSize: '8px', padding: 4 }}
                  />}
              />
          )}
        })}
        </VictoryStack>
      </VictoryChart>
      
      <p className='centreText small cap'>Defect Type and {Pref.phase} as Bars</p>
      
    </div>
  );
};

export default NonConBar;