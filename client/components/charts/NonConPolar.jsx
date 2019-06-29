import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryScatter,
  VictoryChart, 
  VictoryPolarAxis,
  VictoryTooltip
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

export default class NonConPolar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      max: 0,
      min: 0
    };
  }
  
  componentDidMount() {
    const nonConOptions = this.props.ncOp || [];
    
    const nonConArray = this.props.nonCons || [];
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
          //if(typeCount > 0) {
            ncCounts.push({
              x: ncType,
              y: typeCount,
              label: ncSet.phase
            });
          //}
        }
      }
      return ncCounts;
    }
    
    try{
      const appPhases = this.props.app.phases;
      let calc = ncCounter(nonConArrayClean, nonConOptions, appPhases);
      const qu = Array.from(calc, x => x.y);
      const max = Math.max(...qu);
      const min = Math.min(...qu);
      this.setState({
        series: calc,
        max: max,
        min: min
      });
    }catch(err) {
      console.log(err);
    }
  }
          
          
  render() {
    
    //Roles.userIsInRole(Meteor.userId(), 'debug') && 
    console.log(this.state.series);
    //Roles.userIsInRole(Meteor.userId(), 'debug') &&
    console.log(this.state.max, this.state.min);
    
    return(
      <div className='invert chartNoHeightContain'>
      <VictoryChart
        polar
        theme={Theme.NeptuneVictory}
        domainPadding={0}
        style={{padding: { top: 50, right: 50, bottom: 50, left: 50 }}}
      > 
      <VictoryPolarAxis dependentAxis
        //style={{ axis: { stroke: "none" } }}
        tickFormat={(t) => Math.round(t)}
        
      />
      <VictoryPolarAxis
        style={{ 
          ticks: {
            fill: "transparent",
            size: 5,
            stroke: "grey",
          }}}
      />
        
        <VictoryScatter
          data={this.state.series}
          //domain={{x: [this.state.min, this.state.max]}}
          //bubbleProperty="z"
          // maxBubbleSize={this.state.max * 3}
          // minBubbleSize={this.state.min * 3}
          labels={(d) => d.label}
          labelComponent={
            <VictoryTooltip />}
        />
      </VictoryChart>
      </div>
    );
  }
}