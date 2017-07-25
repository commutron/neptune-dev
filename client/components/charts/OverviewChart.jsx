import React, {Component} from 'react';

import {Bar} from "react-chartjs-2";

export default class OverviewChart extends Component {


  render () {

    //let allNC = this.props.ncData.length;
    let allG = this.props.g.length;
    let allW = this.props.w.length;
    let allB = this.props.b.length;

    const chartData = {
      labels: ['Customers', 'Products', 'Work Orders'],
      datasets: [{
        label: '',
        backgroundColor: ['#1abc9c', '#2ecc71', '#3498db'],
        borderColor: ['#1abc9c', '#2ecc71', '#3498db'],
        hoverBackgroundColor: ['#1abc9c', '#2ecc71', '#3498db'],
        data: [allG, allW, allB]
        }],
    };
    
    const chartOptions = {
        scales: {
          yAxes: [{
            type: 'linear',
            ticks: {
              stepSize: 1,
              beginAtZero: true,
            },
          }]
        },
        legend: {
          display: false
        },
        title: {
          display: false
        }
    };

    return (
      <div className='barContain'>

        <Bar data={chartData} options={chartOptions} />

      </div>
    );
  }
}