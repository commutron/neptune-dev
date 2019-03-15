import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import moment from 'moment';
import timezone from 'moment-timezone';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

export default class ProgLayerBurndown extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false,
      first: false
    };
  }
  
  counts() {
    const start = this.props.start;
    const end = this.props.end;
    const flowData = this.props.flowData;
    //const flowAltData = this.props.flowAltData;
    const itemData = this.props.itemData;
    let clientTZ = moment.tz.guess();
    Meteor.call('firstFirst', this.props.id, clientTZ, (error, reply)=> {
      error && console.log(error);
      this.setState({ first: reply });
    });
    Meteor.call('layeredHistoryRate', start, end, flowData, itemData, clientTZ, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ counts: reply });
    });
  }
  
  render () {
    
    const counts = this.state.counts;
    const labels = !counts || counts[0].data;
    const flR = !this.props.floorRelease ? null : 
      moment(this.props.floorRelease.time);
    const frst = this.state.first;

    if(!counts || !frst) {
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
      height: 300,
      showArea: true,
      showLine: true,
      showPoint: false,
      lineSmooth: Chartist.Interpolation.step(),
      axisY: {
        low: 0,
        onlyInteger: true,
        //showLabel: false,
        showGrid: false
      },
      axisX: {
        labelOffset: {x:-20, y: 0},
        divisor: 7,
        labelInterpolationFnc: function(value, index) {
          let scale = labels.length < 7 ?
                      1 :
                      labels.length < 30 ?
                      7 :
                      labels.length < 60 ?
                      14 :
                      30;
          return value.meta == flR ? 'Floor Release ' + value.meta :
                 moment(value.meta, 'MMM.D').isSame(moment(frst, 'MMM.D hh:mm a'), 'day') ? value.meta:
                 index === labels.length - 5 ? null :
                 index === labels.length - 4 ? null :
                 index === labels.length - 3 ? null :
                 index === labels.length - 2 ? null :
                 index === labels.length - 1 ? value.meta :
                 index % scale === 0 ? value.meta : null;
        },
        scaleMinSpace: 25
      },
      chartPadding: {
        top: 20,
        right: 40,
        bottom: 10,
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
      <span className='rateFill'>
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