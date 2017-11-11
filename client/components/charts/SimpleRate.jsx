import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import moment from 'moment';

export default class SimpleRate extends Component {
  
  constructor() {
    super();
    this.labelGenerator = this.labelGenerator.bind(this);  
  }
  
  labelGenerator() {
    let times = [];
    let now = this.props.live ?
              moment() :
              moment(this.props.lastDay);
    for(let i = 0; i < this.props.data.length; i++) {
      let day = now.clone().subtract(i, 'day');
      times.unshift(day.format('MMM D'));
    }
    return times;
  }
  
  render () {
    
    const counts = this.props.data;
    const labels = this.labelGenerator();
    
    let data = {
      labels: labels,
      series: [counts]
    };
    
    let options = {
      fullWidth: true,
      height: 300,
      showLabel: false,
      axisY: {
        low: 0,
        high: Math.max(...counts),
        onlyInteger: true,
        divisor: 10,
      },
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index === labels.length - 1 ? 
                 value :
                 index % 5 === 0 ? 
                 value : 
                 null;
        },
      },
      chartPadding: {
        top: 20,
        right: 20,
        bottom: -10,
        left: -10
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
      ],
    };
    
    return(
      <span className='greenLine'>
        <div>
          <ChartistGraph data={data} options={options} type={'Line'} />
        </div>
      </span>
    );
  }
}