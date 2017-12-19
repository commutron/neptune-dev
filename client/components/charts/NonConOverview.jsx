import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

export default class NonConOverview extends Component {
  
  constructor() {
    super();
    this.state = {
      stackFilter: 'dprt'
    };
    this.ncCounts = this.ncCounts.bind(this);
  }
  
  ncCounts() {
    let splitByFirst = [];
    if(this.state.stackFilter === 'ref') {
      const uniqueRefs = new Set( Array.from(this.props.nonCons, x => x.ref) );
      for(let ref of uniqueRefs) {
        let match = this.props.nonCons.filter( y => y.ref === ref );
        splitByFirst.push({
          'name': ref,
          'ncs': match
        });
      }
    }else{
      const dprt = new Set( Array.from(this.props.flow, x => x.step), Array.from(this.props.flowAlt, x => x.step) );
      for(let stp of dprt) {
        let match = this.props.nonCons.filter( y => y.where === stp );
        splitByFirst.push({
          'name': stp,
          'ncs': match
        });
      }
      let leftover = this.props.nonCons.filter( z => dprt.has(z.where) === false );
      leftover.length > 0 ? splitByFirst.unshift({ 'name': 'before start', 'ncs': leftover }) : null;
    }
    splitByType = [];
    for(let stp of splitByFirst) {
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

    return(
      <div>
        <p className='centreText'>
          <i className='med'>Defect Type and </i>
          <select
            className='transparent blueT'
            ref={(i)=>this.frstFiltr=i} 
            onChange={()=>this.setState({stackFilter: this.frstFiltr.value})}>
            <option value='dprt' defaultValue>Department</option>
            <option value='ref'>Referance</option>
          </select>
        </p>
        <NonConTypeChart counts={counts} ncOp={this.props.ncOp} />
      </div>
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
        <ChartistGraph data={data} options={options} type={'Bar'} />
      </div>
    );
  }
}