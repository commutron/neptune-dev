import React, { Component } from "react";
import Chart from "react-apexcharts";

export default class NonConBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        },
        theme: {
          monochrome: {
            enabled: true,
            color: '#FF0000',
            shadeTo: 'light',
            shadeIntensity: 0.65
          }
        },
        tooltip: {
          theme: 'dark'
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };
  }

  render() {
    return (
      <div className='wide'>
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          width='90%'
        />
      </div>
    );
  }
}