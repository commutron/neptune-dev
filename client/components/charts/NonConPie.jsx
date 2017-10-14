import React, {Component} from 'react';

import {Doughnut} from "react-chartjs-2";

export default class NonConPie extends Component {
  
  splitStatus() {
    let none = 0;
    let fix = 0;
    let done = 0;
    let snooze = 0;
    let skip = 0;
    
    for( let n of this.props.nonCons) {
      n.fix === false && n.inspect === false && n.skip === false ? none += 1 : false;
      n.fix !== false && n.inspect === false && n.skip === false ? fix += 1 : false;
      n.fix !== false && n.inspect !== false && n.skip === false ? done += 1 : false;
      n.skip !== false && n.comm === 'sn00ze' ? snooze += 1 : false;
      n.inspect === false && n.skip !== false && n.comm !== 'sn00ze' ? skip += 1 : false;
    }
    return [ none, fix, done, snooze, skip ];
  }
    
  render () {

    let counts = this.splitStatus();

    const chartData = {
      labels: ['Pending', 'Fixed', 'Inspected', 'Snoozed', 'Skipped'],
      datasets: [{
        label: '',
        backgroundColor: ['#e74c3c', '#e67e22', '#2ecc71', '#f39c12', '#f1c40f'],
        borderWidth: [0, 0, 0, 0, 0],
        hoverBackgroundColor: ['#e74c3c', '#e67e22', '#2ecc71', '#f39c12', '#f1c40f'],
        hoverBorderWidth: [0, 0, 0, 0, 0],
        data: counts
      }],
    };
    
    const chartOptions = {
      cutoutPercentage: 50,
        legend: {
          display: true,
          labels: {
            fontSize: 14,
            fontColor: 'white',
            fontFamily: 'Helvetica Neue, sans-serif'
          }
        },
        title: {
          display: true,
          text: 'NonCons Status',
          fontSize: 16,
          fontColor: 'white',
          fontFamily: 'Helvetica Neue, sans-serif'
        }
    };

    return (
      <div className='inlineContain'>

        <Doughnut data={chartData} options={chartOptions} />

      </div>
    );
  }
}