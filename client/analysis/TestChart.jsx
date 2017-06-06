import React, {Component} from 'react';

// import {Bar} from "react-chartjs-2"; //prop-type depreciation problem

export default class TestChart extends Component {


  render () {

    let allNC = this.props.ncData.length;

    let allBD = this.props.bData.length;

    let allProd = this.props.pData.length;

    const chartData = {
      labels: ['All Boards', 'All Non-Cons', 'All Products'],
      datasets: [{
          label: 'Overview',
          backgroundColor: 'rgb(70,191,189)',
          borderColor: 'rgb(70,191,189)',
          hoverBackgroundColor: 'rgb(37,234,230)',
          data: [allBD, allNC, allProd]
        }],
      options: {
        scales: {
          yAxes: [{
            type: 'linear',
             beginAtZero: true
            //this is not actually making it start at zero. whatsup??
                }]
        }
      }
    };

    return (
      <div className='barContain'>

        {/*<Bar data={chartData} />*/}

      </div>
    );
  }
}