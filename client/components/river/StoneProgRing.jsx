import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
//import Tooltip from 'chartist-plugin-tooltips';

export default class StepsProgress extends Component	{
  
  constructor() {
    super();
    this.state = {
      countDone: 0,
      countRemain: 0
    };
  }
  
  count() {
    const sKey = this.props.sKey;
    //const step = this.props.step;
    const type = this.props.type;
    
    const pre = this.props.progCounts;
    let preFetch = false;
    
    if(type === 'first') {
      null;
    }else{
      const preTotal = this.props.isAlt ?
                        pre.altItems :
                        pre.regItems;
      const preCount = this.props.isAlt ?
                        pre.altStepData.find( x => x.key === sKey ) :
                        pre.regStepData.find( x => x.key === sKey );
      const preDoneNum = preCount ? preCount.items : 0;
      const preRemain = preTotal - preDoneNum;
      preFetch = {preDoneNum, preRemain};
 
      this.setState({ countDone: preFetch.preDoneNum });
      this.setState({ countRemain: preFetch.preRemain });
    }
  }
  
  render() {
    
    if(this.props.type === 'first') {
      
      return(
        <span className='stoneRing centre'>
          <div>
            {this.props.children}
          </div>
        </span>
      );
    }
    
    const done = this.state.countDone;
    const remain = this.state.countRemain;

    let data = {
      series: [done, remain],
    };
    
    let options = {
      width: '100%',
      showLabel: false,
      donut: true,
      donutWidth: 5,
      startAngle: 0,
    };
    
    let wake = 'stoneRing centre glowgreen';
    if(this.props.type === 'build'){
			wake = 'stoneRing centre glowblue';
    }else if(this.props.type === 'checkpoint'){
			wake = 'stoneRing centre glowwhite';
    }else if(this.props.type === 'test'){
			wake = 'stoneRing centre glowteal';
    }else if(this.props.type === 'finish'){
			wake = 'stoneRing centre glowpurple';
    }else{
      null }
    
    return(
      <span className={wake}>
        <ChartistGraph data={data} options={options} type={'Pie'}>
          {this.props.children}
        </ChartistGraph>
      </span>
    );
  }
  componentDidMount() {
    this.count();
  }
}