import React, {Component} from 'react';

import {Bar} from "react-chartjs-2";

export default class NonConOverview extends Component {
  
  
  ncTypes() {
    let counts = [];
    for(let n of this.props.ncOp) {
      let match = this.props.nonCons.filter( x => x.type === n );
      counts.push(match.length);
    }
    return counts;
  }

  render () {

    const count = this.ncTypes();

    const chartData = {
      labels: this.props.ncOp,
      datasets: [{
        label: '',
        backgroundColor: '#c0392b',
        borderColor: '#c0392b',
        hoverBackgroundColor: '#e74c3c',
        data: count
        }],
    };
    
    const chartOptions = {
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {
              stepSize: 5,
              beginAtZero: true,
            },
          }]
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Total: ' + this.props.nonCons.length,
        }
    };

    return (
      <div className='inlineContain'>

        <Bar data={chartData} options={chartOptions} />

      </div>
    );
  }
}