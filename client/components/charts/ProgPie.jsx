import React, {Component} from 'react';
import ChartistGraph from 'react-chartist';


export default class ProgPie extends Component {
  
  render () {
    
    const count = this.props.count;
    const total = this.props.total - this.props.count;
    
    let data = {
      //labels: [count, total],
      series: [count, total],
    };
    
    let options = {
      width: 60,
      height: 60,
      showLabel: false
    };
    
    let sty = total === 0 ? 'monoPieDone' : 'monoPie';
    
    return(
      <span className='miniContain'>
        <div className={sty} title={count + ' Done, ' + total + ' Remaining'}>
          <ChartistGraph data={data} options={options} type={'Pie'} />
        </div>
        <p className='centreText cap small'>{this.props.title}</p>
      </span>
    );
  }
}