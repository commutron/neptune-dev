import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import FilterTools from '../../../components/smallUi/FilterTools.jsx';

export default class ItemsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
  }
  
  mark() {
    const b = this.props.batchData;
    let ipList = [];
    let scList = [];
    if(b) {
      b.items.map( (entry)=>{
        // check if item is done
        if(entry.finishedAt === false) {
          ipList.push(entry.serial);
        }else{
          // check for scrap items
          for(let v of entry.history) {
            v.type === 'scrap' ? scList.push(entry.serial) : null;
          }
        }
      });
     return [ipList, scList];
   }else{null}
 }

  render() {
    
    const b = this.props.batchData;
    
    const mark = this.mark();
    const active = b ? mark[0] : [];
    const scrap = b ? mark[1] : [];
    
    const f = this.state.filter;
    let showList = 
      f === 'done' ?
      b.items.filter( x => x.finishedAt !== false) :
      f === 'inproc' ?
      b.items.filter( x => x.finishedAt === false) :
      b.items;
                    

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
        
          <FilterTools
            title={b.batch}
            total={showList.length}
            onClick={e => this.setFilter(e)} />
        
          {this.props.listTitle ? <h2 className='up'>{b.batch}</h2> : null}
            { showList.map( (entry, index)=> {
            let style = active.includes(entry.serial) ? 'jumpBar gMark' : 
                        scrap.includes(entry.serial) ? 'jumpBar ngMark' : 
                        'jumpBar';
            let inStyl = entry.serial === Session.get('now');
              return (
                <JumpButton
                  key={index} 
                  title={entry.serial} 
                  sub='' 
                  sty={style}
                  inStyle={inStyl}
                />
              );
            })}
  			</div>
			</AnimateWrap>
    );
  }
}