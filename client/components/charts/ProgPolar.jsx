import React, {Component} from 'react';

import {Polar} from "react-chartjs-2";

export default class ProgPolar extends Component {
    
  render () {

    const total = this.props.total;
    
    let color = total === 0 ? 'rgb(39, 174, 96)' : 'rgb(41, 128, 185)';
    
    let lightColor = total === 0 ? 'rgb(46, 204, 113)' : 'rgb(52, 152, 219)';

    const chartData = {
      labels: this.props.steps,
      datasets: [{
        data: this.props.counts,
        label: '',
        backgroundColor: [color, 'red', 'green', 'pink', 'blue'],
        borderWidth: [0, 0],
        hoverBorderWidth: [0, 0],
      }],
    };
    
    const chartOptions = {
      animation: false,
      legend: {
        display: false,
      },
      title: {
        display: false
      },
      scales: {
        
        yAxes: [{
          type: 'radial',
          ticks: {
            max: total,
            min: total,

            stepSize: 1,
            beginAtZero: true,
            fontSize: 12,
            fontColor: 'white',
            fontFamily: 'Helvetica Neue, sans-serif'
          },
        }],
      },
    };

    return (
      <span>
        <div className='smallContain'>
          <Polar data={chartData} options={chartOptions} />
        </div>
      </span>
    );
  }
}