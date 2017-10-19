import React, {Component} from 'react';
import ChartistGraph from 'react-chartist';

export default class ProgMultiCircle extends Component {
    
  render () {

    const total = this.props.total;
    //this.props.steps,
    //data: this.props.counts,
      

    return (
      <span className='layeredCircles'>
        {this.props.steps.map( (entry, index)=>{
          return(
            <NestedCircle key={index} in={index} step={entry} count={this.props.counts[index]} total={total} />
        )})}
      </span>
    );
  }
}


export class NestedCircle extends Component {
  
  render () {
    
    const num = this.props.in + 1;
    
    const count = this.props.count;
    const total = this.props.total - this.props.count;
    
    let data = {
      //labels: [count, total],
      series: [count, total],
    };
    
    let options = {
      width: 75*num,
      height: 75*num,
      showLabel: false,
      donut: true,
      donutWidth: 10,
      startAngle: 0,
      
    };
    
    let clss = total === 0 ? 'monoDonDone' : 'monoDon';
    
    return(
      <span className={clss} title={count + ' Done, ' + total + ' Remaining'}>
        <ChartistGraph data={data} options={options} type={'Pie'} />
      </span>
    );
  }
}