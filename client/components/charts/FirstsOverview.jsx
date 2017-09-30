import React, {Component} from 'react';

import {Bar} from "react-chartjs-2";

export default class FirstsOverview extends Component {
  
  firstSteps() {
    let firsts = this.props.doneFirsts;

    let flow = this.props.flow;
    let flowAlt = this.props.flowAlt;
    
    let steps = new Set();
    if(flow) {
      for(let s of flow) {
        if(s.type === 'first') {
          let done = firsts.filter( x => x.fKey === s.key);
          steps.add( { step: s.step, count: done.length } );
        }else{null}
      }
    }else{null}
    if(flowAlt) {
      for(let as of flowAlt) {
        if(as.type === 'first') {
          let done = firsts.filter( x => x.fKey === as.key);
          steps.add( { step: as.step, count: done.length } );
        }else{null}
      }
    }else{null}
    let niceSteps = [...steps].filter( ( v, indx, slf ) => slf.findIndex( x => x.step === v.step ) === indx);
    return niceSteps;
  }


  render() {
    
    const stepsObj = this.firstSteps();
    
    let steps = [];
    stepsObj.forEach( x => steps.push(x.step) );
    
    let counts = [];
    stepsObj.forEach( x => counts.push(x.count) );

    const chartData = {
      labels: steps,
      datasets: [{
        label: '',
        backgroundColor: '#2980b9',
        borderColor: '#2980b9',
        hoverBackgroundColor: '#3498db',
        data: counts
        }],
    };
    
    const chartOptions = {
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {
              stepSize: 5,
              beginAtZero: true,
              fontSize: 12,
              fontColor: 'white',
              fontFamily: 'Helvetica Neue, sans-serif'
            },
          }],
          xAxes: [{
            type: 'category',
            labels: steps,
            ticks: {
              autoSkip: false,
              fontSize: 14,
              fontColor: 'white',
              fontFamily: 'Helvetica Neue, sans-serif'
            }
          }]
        },
        legend: {
          display: false,
        },
        title: {
          display: false
        },
        
    };

    return (
      <div className='inlineContain up'>
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  }
}