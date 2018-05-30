import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

export default class NonConRate extends Component {
  
  constructor() {
    super();
    this.state = {
      ratesC: false,
      ratesL: false
    };
  }
  
  loop() {
    Meteor.call('nonConRateLoop', this.props.batches, (error, reply)=>{
      if(error)
        console.log(error);
      this.setState({ ratesC: reply.counts, ratesL: reply.labels });
    });
  }
  
  render () {
    
    const counts = this.state.ratesC;
    const labels = this.state.ratesL;
    
    if(!counts || !labels) {
      return(
        <CalcSpin />
      );
    }
    
    let data = {
      labels: labels,
      series: counts
    };
    
    let options = {
      fullWidth: true,
      height: 350,
      showArea: true,
      showLine: true,
      showPoint: false,
      showLabel: false,
      axisY: {
        low: 0,
        onlyInteger: true,
        divisor: 10,
        labelOffset: {x:0, y: 10},
      },
      axisX: {
        labelOffset: {x:-20, y: 0},
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
          return index === labels.length - 5 ? null :
                 index === labels.length - 4 ? null :
                 index === labels.length - 3 ? null :
                 index === labels.length - 2 ? null :
                 index === labels.length - 1 ? value :
                 index % scale === 0 ? value : null;
        },
      },
      chartPadding: {
        top: 30,
        right: 30,
        bottom: 0,
        left: 0
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
      ],
    };
    
    return(
      <span>
        
        <div>
          <ChartistGraph data={data} options={options} type={'Line'} />
        </div>
      </span>
    );
  }
  componentDidMount() {
    this.loop();
  }
}