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
      width: 600,
      height: 700,
      horizontalBars: true,
      reverseData: true,
      stretch: true,
      axisX: {
        low: 0,
        high: Math.max(...counts),
        onlyInteger: true,
      },
      axisY: {
        offset: 100
      },
      chartPadding: {
        top: 25,
        right: 25,
        bottom: 25,
        left: 25
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        })
      ]
    };

    return (
      <div>
        <ChartistGraph data={data} options={options} type={'Bar'} />
      </div>
    );
  }
}