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
      max: 1,
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
      const symOp = ["square", "triangleUp", "triangleDown", "diamond", "plus", "minus", "star"];
      [...phasesSet].map( (phase, index)=>{
        let match = ncArray.filter( y => y.where === phase );
        splitByPhase.push({
          'phase': phase,
          'pNC': match,
          'sym': symOp[index] || "circle"
        });
      });
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
              label: ncSet.phase,
              symbol: ncSet.sym
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
        height={400}
        theme={Theme.NeptuneVictory}
        domainPadding={10}
        padding={75}
      > 
      <VictoryPolarAxis dependentAxis
        //style={{ axis: { stroke: "none" } }}
        tickFormat={(t) => Math.round(t)}
      />
      <VictoryPolarAxis />
        
        <VictoryScatter
          data={this.state.series}
          domain={{y: [this.state.min, this.state.max]}}
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