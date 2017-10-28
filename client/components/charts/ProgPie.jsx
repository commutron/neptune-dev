import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import fillDonut from 'chartist-plugin-fill-donut';
import Tooltip from 'chartist-plugin-tooltips';

export default class ProgPie extends Component {
  
  render () {
    
    const count = this.props.count;
    const total = this.props.total;
    const remain = total - count;
    
    let data = {
      //labels: [count, total],
      series: [count, remain],
    };
    
    let options = {
      width: 60,
      height: 60,
      showLabel: false,
      donut: true,
      donutWidth: 7,
      startAngle: 0,
      plugins: [
        Chartist.plugins.fillDonut({
          items: [{
            content: '<i>' + count + '</i>',
            position: 'center',
            offsetY : -3,
            offsetX: 0
          }],
        }),
        Chartist.plugins.tooltip({
          appendToBody: true
        })
      ],
    };
    
    let sty = remain === 0 ? 'monoDonDone' : 'monoDon';
    
    return(
      <span className='miniContain'>
        <div className={sty}>
          <ChartistGraph data={data} options={options} type={'Pie'} />
        </div>
        <p className='centreText cap small'>{this.props.title}</p>
      </span>
    );
  }
}