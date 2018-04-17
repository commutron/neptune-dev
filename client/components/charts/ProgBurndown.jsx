import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import moment from 'moment';
import timezone from 'moment-timezone';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

export default class ProgBurndown extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false,
      labels: false
    };
  }
  
  counts() {
    const start = this.props.start;
    const end = this.props.end;
    const flowData = this.props.flowData;
    const flowAltData = this.props.flowAltData;
    const itemData = this.props.itemData;
    let clientTZ = moment.tz.guess();
  
    Meteor.call('historyRate', start, end, flowData, flowAltData, itemData, clientTZ, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ counts: reply.counts, labels: reply.labels });
    });
  }
  
  render () {
    
    const counts = this.state.counts;
    const labels = this.state.labels;
    
    if(!counts || !labels) {
      return(
        <CalcSpin />
      );
    }
    
    let data = {
      labels: labels,
      series: [counts]
    };
    
    let options = {
      fullWidth: true,
      height: 300,
      showLabel: false,
      showArea: true,
      showLine: true,
      showPoint: false,
      axisY: {
        low: 0,
        onlyInteger: true,
        showLabel: false,
        showGrid: false
      },
      axisX: {
        divisor: 7,
        labelInterpolationFnc: function(value, index) {
          let scale = labels.length < 7 ?
                      1 :
                      labels.length < 30 ?
                      4 :
                      labels.length < 60 ?
                      8 :
                      labels.length < 90 ?
                      12 :
                      16;
          return index === labels.length - 4 ? null :
                 index === labels.length - 3 ? null :
                 index === labels.length - 2 ? null :
                 index === labels.length - 1 ? value :
                 index % scale === 0 ? value : null;
        },
      },
      chartPadding: {
        top: 20,
        right: 40,
        bottom: 0,
        left: 0
      },
    };
    
    return(
      <span className='rateFill'>
        <div className='wide balance cap'>
          <i className='blueT'>{this.props.title}</i>
        </div>
        <div>
          <ChartistGraph data={data} options={options} type={'Line'} />
        </div>
      </span>
    );
  }
  componentDidMount() {
    this.counts();
  }
}