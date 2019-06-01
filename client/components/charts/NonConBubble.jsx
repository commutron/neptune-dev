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
          categories: this.props.ncOp
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
          name: "",
          data: []
        }
      ]
    };
  }
  
  componentDidMount() {
    const nonConOptions = this.props.ncOp || [];
    
    const nonConArray = this.props.nonCons || [];
    const nonConArrayClean = nonConArray.filter( x => !x.trash );
    
    function ncCounter(ncArray, ncOptions) {
      let ncCounts = [];
      //let ncLabels = [];
      for(let ncType of ncOptions) {
        const typeCount = ncArray.filter( x => x.type === ncType ).length;
        ncCounts.push(typeCount);
        //ncLabels.push(ncType);
      }
      return ncCounts;
    }
    
    try{
      let calc = ncCounter(nonConArrayClean, nonConOptions);
      this.setState({
        series: [
          { data: calc }
        ],
      });
    }catch(err) {
      console.log(err);
    }
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