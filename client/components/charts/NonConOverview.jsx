import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

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
      leftover.length > 0 ? splitByFirst.unshift({ 'name': 'unknown', 'ncs': leftover }) : null;
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
        <p className='centreText listSortInput'>
          <i className='med'>Defect Type and </i>
          <select
            ref={(i)=>this.frstFiltr=i} 
            onChange={()=>this.setState({stackFilter: this.frstFiltr.value})}>
            <option value='dprt' defaultValue>Department</option>
            <option value='ref'>Reference</option>
          </select>
        </p>
        <NonConTypeChart
          counts={counts}
          labels={this.props.ncOp}
          stack={true} />
      </div>
    );
  }
}

export const NonConTypeChart = ({ counts, labels, stack })=> {

  let heightCalc = (labels.length * 75) + (counts.length * 15);
  
  let data = {
    labels: labels,
    series: counts,
  };
  
  let options = {
    height: heightCalc,
    fullWidth: true,
    horizontalBars: true,
    stretch: false,
    stackBars: stack,
    seriesBarDistance: 15,
    axisX: {
      low: 0,
      onlyInteger: true,
      position: 'start',
      labelOffset: {x:-5, y: 0},
    },
    chartPadding: {
      top: 25,
      right: 25,
      bottom: 25,
      left: 50
    },
    plugins: [
      Chartist.plugins.tooltip({
        appendToBody: true,
        class: 'cap'
      })
    ]
  };

  return (
    <ChartistGraph data={data} options={options} type={'Bar'} />
  );
};