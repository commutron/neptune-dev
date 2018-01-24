import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
//import Tooltip from 'chartist-plugin-tooltips';

export default class StepsProgress extends Component	{
  
  constructor() {
    super();
    this.state = {
      count: {
        done: 0,
        remain: 0
      }
    };
  }
  
  count() {
    const sKey = this.props.sKey;
    const step = this.props.step;
    const type = this.props.type;
    
    if(type === 'first') {
      null;
    }else{
      const allitems = this.props.allItems;
      const item = allitems.find( x => x.serial === this.props.serial );
      const items = item.alt === 'yes' ?
                    allitems.filter( x => x.alt === 'yes' ) : 
                    allitems.filter( x => x.alt === 'no' || x.alt === false );
      const total = items.length;
      
      const byKey = (t, ky)=> { return ( x => x.key === ky && x.good === true )};
      const byName = (t, nm)=> { return ( x => x.step === nm && x.type === 'first' && x.good === true )};
      
      let itemCount = 0;
      for(let i of items) {
        const h = i.history;
        if(type === 'inspect') {
          h.find( byKey(this, sKey) ) ? itemCount += 1 : null;
          h.find( byName(this, step) ) ? itemCount += 1 : null;
        }else{
          h.find( byKey(this, sKey) ) ? itemCount += 1 : null;
        }
      }
      const remain = total - itemCount;
      this.setState({ count: { done: itemCount, remain: remain } });
    }
  }
  
  render() {
    
    if(this.props.type === 'first') {
      
      let sty = {
        width: '15.5rem',
        height: '15.5rem',
      };
      
      return(
        <span className='stoneRing centre'>
          <div style={sty}>
            {this.props.children}
          </div>
        </span>
      );
    }
    
    const counter = this.state.count;
    
    let data = {
      series: [counter.done, counter.remain],
    };
    
    let options = {
      width: '15.5rem',
      height: '15.5rem',
      showLabel: false,
      donut: true,
      donutWidth: 5,
      startAngle: 0,
      /*
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
      ],
      */
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