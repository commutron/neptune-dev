import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

export default class NonConOverview extends Component {
  
  ncCounts() {
    const dprt = new Set( Array.from(this.props.trOp, x => x.step) );
    dprt.add(this.props.lstOp.step);
    let splitByStep = [];
    for(let stp of dprt) {
      let match = this.props.nonCons.filter( y => y.where === stp );
      splitByStep.push({
        'name': stp,
        'ncs': match
      });
    }
    splitByType = [];
    for(let stp of splitByStep) {
      let type = [];
      for(let n of this.props.ncOp) {
        let match = stp.ncs.filter( x => x.type === n );
        type.push({
          'value': match.length,
          'meta': stp.name
        });
      }
      splitByType.push(type); 
    }
    return splitByType;
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
      series: counts,
    };
    
    let options = {
      height: 800,
      fullWidth: true,
      horizontalBars: true,
      stretch: false,
      stackBars: true,
      axisX: {
        low: 0,
        onlyInteger: true,
        position: 'start'
      },
      axisY: {
        offset: 100
      },
      chartPadding: {
        top: 10,
        right: 20,
        bottom: 20,
        left: 20
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true,
          class: 'cap'
        })
      ]
    };

    return (
      <div>
        <br />
        <p className='centreText'>
          <i>Defect Type and Process</i><br />
        </p>
        <ChartistGraph data={data} options={options} type={'Bar'} />
      </div>
    );
  }
}