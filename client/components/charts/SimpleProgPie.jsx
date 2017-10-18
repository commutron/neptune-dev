import React, {Component} from 'react';

import {Pie} from "react-chartjs-2";

export default class SimpleProgPie extends Component {
    
  render () {

    const count = this.props.count;
    const total = this.props.total - this.props.count;
    
    let color = total === 0 ? 'rgb(39, 174, 96)' : 'rgb(41, 128, 185)';
    
    let lightColor = total === 0 ? 'rgb(46, 204, 113)' : 'rgb(52, 152, 219)';

    const chartData = {
      labels: ['Done', 'Remaining'],
      datasets: [{
        label: '',
        backgroundColor: [color, 'rgba(0,0,0,0.1)'],
        borderWidth: [0, 0],
        hoverBackgroundColor: [lightColor, 'rgba(0,0,0,0.1)'],
        hoverBorderWidth: [0, 0],
        data: [count, total]
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
      maintainAspectRatio: true
      
    };

    return (
      <span>
        <div className='miniContain'>
          <Pie data={chartData} options={chartOptions} height={40} width={150} />
        </div>
        <p className='centreText cap small'>{this.props.title}</p>
      </span>
    );
  }
}