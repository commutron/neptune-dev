import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTooltip
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

export default class NonConBubble extends Component {
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
      const appPhases = this.props.app.phases;
      let calc = ncCounter(nonConArrayClean, nonConOptions, appPhases);
      const qu = Array.from(calc, x => x.z);
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
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(this.state.series);
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(this.state.max, this.state.min);
    
    return(
      <div className='invert chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        domainPadding={20}
      >
        <VictoryAxis />
        <VictoryAxis 
          dependentAxis
          //fixLabelOverlap={true} 
        />
        <VictoryScatter
          data={this.state.series}
          domain={{z: [this.state.min, this.state.max]}}
          bubbleProperty="z"
          maxBubbleSize={this.state.max}
          minBubbleSize={this.state.min}
          labels={(d) => `Quantity: ${d.z}`}
          labelComponent={
            <VictoryTooltip />}
        />
      </VictoryChart>
      </div>
    );
  }
}