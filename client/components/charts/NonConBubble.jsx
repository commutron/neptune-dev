import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip,
  VictoryClipContainer
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NonConBubble = ({ ncOp, flow, flowAlt, nonCons, app })=> {
  
  const [ series, seriesSet ] = useState([]);
    
  
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
        for(let ncType of ncOptions) {
          const typeCount = ncSet.pNC.filter( x => x.type === ncType ).length;
          if(typeCount > 0) {
            ncCounts.push({
              x: ncSet.phase,
              y: ncType,
              z: typeCount
            });
          }
        }
      }
      return ncCounts;
    }
    
    try{
      const appPhases = app.phases;
      let calc = ncCounter(nonConArrayClean, nonConOptions, appPhases);
      // const qu = Array.from(calc, x => x.z);
      // const max = Math.max(...qu);
      // const min = Math.min(...qu);
      seriesSet(calc);
      // this.setState({
      //   max: max,
      //   min: min
      // });
    }catch(err) {
      console.log(err);
    }
  }, []);
          

    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(series);
    
  return(
    <div className='invert chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 20, right: 20, bottom: 20, left: 120}}
        domainPadding={25}
      >
        <VictoryAxis
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
          dependentAxis
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
        <VictoryScatter
          data={series}
          // domain={{z: [this.state.min, this.state.max]}}
          bubbleProperty="z"
          // maxBubbleSize={this.state.max}
          // minBubbleSize={this.state.min}
          labels={(d) => `Quantity: ${d.z}`}
          groupComponent={<VictoryClipContainer/>}
          labelComponent={
            <VictoryTooltip />}
          style={ {
            data: { 
              fill: 'rgba(231,76,60,0.2)',
              stroke: 'rgb(100,100,100)',
              strokeWidth: 1
          } } }
        />
      </VictoryChart>
    </div>
  );
};

export default NonConBubble;