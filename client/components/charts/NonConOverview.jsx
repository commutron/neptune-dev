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
    
    
    let data = {
      labels: this.props.ncOp,
      series: [counts],
    };
    
    let options = {
      width: 500,
      height: 500,
      horizontalBars: true,
      reverseData: true,
      stretch: false,
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
      <div className=''>
        
        <ChartistGraph data={data} options={options} type={'Bar'} />

      </div>
    );
  }
}