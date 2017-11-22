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
    for(let i = 0; i < this.props.dataOne.length; i++) {
      let day = now.clone().subtract(i, 'day');
      times.unshift(day.format('MMM.D'));
    }
    return times;
  }
  
  render () {
    
    const countsOne = this.props.dataOne;
    const maxOne = Math.max(...countsOne);
    const countsTwo = this.props.dataTwo;
    const maxTwo = Math.max(...countsTwo);
    const labels = this.labelGenerator();
    
    let data = {
      labels: labels,
      series: [countsOne, countsTwo]
    };
    
    let options = {
      fullWidth: true,
      height: 300,
      showLabel: false,
      axisY: {
        low: 0,
        high: maxOne >= maxTwo ? maxOne : maxTwo,
        onlyInteger: true,
        divisor: 10,
      },
      axisX: {
        labelInterpolationFnc: function(value, index) {
          let scale = labels.length > 31 ? 91 : 7;
          return index === labels.length - 1 ? 
                 value :
                 index % scale === 0 ? 
                 value : 
                 null;
        },
      },
      chartPadding: {
        top: 20,
        right: 45,
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
      <span className='rateLines'>
        <div className='wide balance cap'>
          <i className='greenT'>{this.props.titleOne}</i>
          <i className='redT'>{this.props.titleTwo}</i>
        </div>
        <div>
          <ChartistGraph data={data} options={options} type={'Line'} />
        </div>
      </span>
    );
  }
}