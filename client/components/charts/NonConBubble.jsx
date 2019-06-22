import React, { Component } from "react";
import Chart from "react-apexcharts";

export default class NonConBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "legacyHeatMap",
        },
        xaxis: {
          categories: this.props.ncOp,
          type: 'category',
          labels: {
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: true,
            //trim: false,
            minHeight: 100,
            maxHeight: 200,
          },
        },
        yaxis: {
          show: true,
          decimalsInFloat: 1,
          labels: {
            formatter: val => val.toFixed(1)
          },
        },
        heatmap: {
          distributed: true
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: 'solid',
        },
        title: {
          text: 'Heat Map'
        },
        theme: {
          monochrome: {
            enabled: true,
            color: '#FF0000',
            shadeTo: 'dark',
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
    
    function ncCounter(ncArray, ncOptions, appPhases) {
      
      let splitByPhase = [];
      
      const phasesSet = new Set(appPhases);
      for(let phase of phasesSet) {
        let match = ncArray.filter( y => y.where === phase );
        splitByPhase.push({
          'phase': phase,
          'pNC': match
        });
      }
      let leftover = ncArray.filter( z => phasesSet.has(z.where) === false );
      splitByPhase.unshift({ 'phase': 'other', 'pNC': leftover });
      
      console.log(splitByPhase);
      
      let ncPhaseSeries = [];
      
      for(let ncSet of splitByPhase) {
        //let ncLabels = [];
        let ncCounts = [];
        for(let ncType of ncOptions) {
          const typeCount = ncSet.pNC.filter( x => x.type === ncType ).length;
          ncCounts.push({
            x: ncType,
            y: typeCount
          });
          //ncLabels.push(ncType);
        }
        ncPhaseSeries.push({ 
          name: ncSet.phase,
          data: ncCounts
        });
      }
      
      return ncPhaseSeries;
    }
    
    try{
      const appPhases = this.props.app.phases;
      let calc = ncCounter(nonConArrayClean, nonConOptions, appPhases);
      this.setState({
        series: calc,
      });
    }catch(err) {
      console.log(err);
    }
  }

  render() {
    
    console.log(this.state.series);
    
    return (
      <div className='wide'>
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="heatmap"
          width='90%'
        />
      </div>
    );
  }
}