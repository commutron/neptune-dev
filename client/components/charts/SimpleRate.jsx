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
    let range = this.props.titleOne ?
                this.props.dataOne.length :
                this.props.titleTwo ?
                this.props.dataTwo.length :
                this.props.dataThree.length;
    for(let i = 0; i < range; i++) {
      if(this.props.timeRange === 'day' || this.props.timeRange === 'hour') {
        let fqu = now.clone().subtract(i, 'hour');
        times.unshift(fqu.format('h.A'));
      }else if(this.props.timeRange === 'week') {
        let fqu = now.clone().subtract(i, 'day');
        times.unshift(fqu.format('ddd'));
      }else{
        let day = now.clone().subtract(i, 'day');
        times.unshift(day.format('MMM.D'));
      }
    }
    return times;
  }
  
  render () {
    
    const countsOne = this.props.dataOne;
    const maxOne = Math.max(...countsOne);
    const countsTwo = this.props.dataTwo;
    const maxTwo = Math.max(...countsTwo);
    const countsThree = this.props.dataThree;
    const maxThree = Math.max(...countsThree);
    const labels = this.labelGenerator();
    const range = this.props.timeRange;
    
    let data = {
      labels: labels,
      series: [countsOne, countsTwo, countsThree]
    };
    
    let options = {
      fullWidth: true,
      height: 300,
      showLabel: false,
      axisY: {
        low: 0,
        high: Math.max(...[maxOne, maxTwo, maxThree]),
        onlyInteger: true,
        divisor: 10,
      },
      axisX: {
        labelInterpolationFnc: function(value, index) {
          let scale = range === 'year' ? 90 :
                      range === 'month' ? 5 :
                      range === 'week' ? 1 : 7;
          return index % scale === 0 ? 
                 value : 
                 index === labels.length - 1 ? 
                 value :
                 null;
        },
      },
      chartPadding: {
        top: 20,
        right: 45,
        bottom: 0,
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
          {this.props.titleOne &&
            <i className='blueT'>{this.props.titleOne}</i>}
          <i className='redT'>{this.props.titleTwo}</i>
          <i className='greenT'>{this.props.titleThree}</i>
        </div>
        <div>
          <ChartistGraph data={data} options={options} type={'Line'} />
        </div>
      </span>
    );
  }
}