import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
//import Tooltip from 'chartist-plugin-tooltips';
import moment from 'moment';
import timezone from 'moment-timezone';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

export default class ProgLayerBurndown extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false,
      labels: false,
      first: false
    };
  }
  
  counts() {
    const start = this.props.start;
    const end = this.props.end;
    const flowData = this.props.flowData;
    const itemData = this.props.itemData;
    let clientTZ = moment.tz.guess();
    Meteor.call('firstFirst', this.props.id, clientTZ, (error, reply)=> {
      error && console.log(error);
      this.setState({ first: reply });
    });
    Meteor.call('layeredHistoryRate', start, end, flowData, itemData, clientTZ, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ counts: reply.flowSeries, labels: reply.timeLabels });
    });
  }
  
  render () {
    
    const counts = this.state.counts;
    const labels = this.state.labels;
    
    const flR = !this.props.floorRelease ? null : 
      moment(this.props.floorRelease.time);
    const frst = this.state.first;

    if(!counts || !labels || !frst) {
      return(
        <CalcSpin />
      );
    }
    
    let data = {
      series: counts,
      labels: labels
    };
    
    let options = {
      fullWidth: true,
      height: 350,
      showArea: true,
      showLine: true,
      showPoint: false,
      lineSmooth: Chartist.Interpolation.step(),
      axisY: {
        labelOffset: {x:0, y: 10},
        low: 0,
        onlyInteger: true,
        showLabel: true,
        showGrid: true,
      },
      axisX: {
        labelOffset: {x:-20, y: 0},
        //divisor: 7,
        labelInterpolationFnc: function(value, index) {
          let scale = labels.length < 7 ?
                      1 :
                      labels.length < 30 ?
                      4 :
                      labels.length < 60 ?
                      8 :
                      labels.length < 90 ?
                      12 :
                      labels.length < 120 ?
                      24 :
                      36;
                  //moment(value).isSame(moment(flR), 'day') ? 
                 //moment(value).format('MMM.D') :
          return moment(value).isSame(moment(frst), 'day') ? 
                 moment(value).format('MMM.D') :
                 index === 0 ? null :
                 index === labels.length - 5 ? null :
                 index === labels.length - 4 ? null :
                 index === labels.length - 3 ? null :
                 index === labels.length - 2 ? null :
                 index === labels.length - 1 ? 
                 moment(value).format('MMM.D') :
                 index % scale === 0 ? 
                 moment(value).format('MMM.D') : 
                 null;
        },
        scaleMinSpace: 25
      },
      chartPadding: {
        top: 20,
        right: 40,
        bottom: 0,
        left: 0
      },
      /*
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
      ]
      */
    };
    
    return(
      <span className='burndownFill'>
        <div className='wide balance cap'>
          <i className='blueT'>{this.props.title}</i>
        </div>
        <div>
          <ChartistGraph
            data={data}
            options={options}
            type={'Line'} />
        </div>
      </span>
    );
  }
  componentDidMount() {
    this.counts();
  }
}