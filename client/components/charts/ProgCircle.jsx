import React, {Component} from 'react';

import {Doughnut} from "react-chartjs-2";

export default class OverviewChart extends Component {


  render () {

    let done = this.props.numOne;
    let total = 10 - done;

    const chartData = {
      labels: ['Done', 'left'],
      datasets: [{
        label: '',
        backgroundColor: ['#1abc9c', 'rgba(255,255,255,0.1)'],
        borderColor: ['#1abc9c', 'rgba(255,255,255,0.1)'],
        hoverBackgroundColor: ['#1abc9c', 'rgba(255,255,255,0.1)'],
        data: [done, total]
        }],
    };
    
    const chartOptions = {
      animation: false,
      cutoutPercentage: 70,
        legend: {
          display: false
        },
        title: {
          display: false
        }
    };

    return (
      <div className=''>

        <Doughnut data={chartData} options={chartOptions} />

      </div>
    );
  }
}