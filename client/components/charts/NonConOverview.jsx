import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

export default class NonConOverview extends Component {
  
  ncCounts() {
    let counts = [];
    for(let n of this.props.ncOp) {
      let match = this.props.nonCons.filter( x => x.type === n );
      counts.push(match.length);
    }
    return counts;
  }

  render () {

    const counts = this.ncCounts();

    return (
      <NonConTypeChart counts={counts} ncOp={this.props.ncOp} />
    );
  }
}

export class NonConTypeChart extends Component {

  render () {

    const counts = this.props.counts;
    
    let data = {
      labels: this.props.ncOp,
      series: [counts],
    };
    
    let options = {
      height: 800,
      horizontalBars: true,
      reverseData: true,
      stretch: false,
      axisX: {
        low: 0,
        high: Math.max(...counts),
        onlyInteger: true,
        position: 'start'
      },
      axisY: {
        offset: 150
      },
      chartPadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        })
      ]
    };

    return (
      <div className='min400'>
        <ChartistGraph data={data} options={options} type={'Bar'} />
      </div>
    );
  }
}

export class NonConTypePie extends Component {

  render () {

    const counts = this.props.counts;
    
    let mergedSeries = [];
    counts.forEach( (x, index) => 
                      mergedSeries.push({
                        'value': x,
                        'meta': this.props.ncOp[index]
                      }) );

    let data = {
      labels: this.props.ncOp,
      series: mergedSeries,
    };
    
    let options = {
      width: 250,
      height: 250,
      donut: true,
      donutWidth: 60,
      startAngle: 0,
      showLabel: false,
      chartPadding: 25,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        })
      ]
    };
    
    let sty = {
      width: '250px',
      display: 'inline-block',
      margin: '0 auto'
    };

    return (
      <div style={sty}>
        <ChartistGraph data={data} options={options} type={'Pie'} />
      </div>
    );
  }
}