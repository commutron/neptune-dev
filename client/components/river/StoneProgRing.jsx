import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

export default class StepsProgress extends Component	{
  
  count() {
    const sKey = this.props.sKey;
    const step = this.props.step;
    const type = this.props.type;
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

    remain = total - itemCount;
    
    return { done: itemCount, remain: remain };
    
  }
  
  render() {
    
    const counter = this.count();
    
    let data = {
      series: [counter.remain, counter.done],
    };
    
    let options = {
      width: '16rem',
      height: '16rem',
      showLabel: false,
      donut: true,
      donutWidth: 5,
      startAngle: 0,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
      ],
    };
    
    return(
   
        <span className='stoneRing centre'>
          <ChartistGraph data={data} options={options} type={'Pie'}>
            <span className='stoneCenter'>
              {this.props.children}
            </span>
          </ChartistGraph>
        </span>
      
    );
  }
}