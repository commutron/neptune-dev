import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import FilterItems from '../../../components/bigUi/FilterItems.jsx';

export default class ItemsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false,
      advancedKey: false
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
  }
  
  setAdvancedFilter(rule) {
    this.setState({ advancedKey: rule });
  }
  
  scraps() {
    const b = this.props.batchData;
    let scList = [];
    if(b) {
      b.items.map( (entry)=>{
        // check for scrap items
        for(let v of entry.history) {
          v.type === 'scrap' ? scList.push(entry.serial) : null;
        }
      });
      return scList;
    }else{null}
  }
  
  flowSteps() {
    let flow = this.props.widgetData.flows.find( x => x.flowKey === this.props.batchData.river );
    let flowAlt = this.props.widgetData.flows.find( x => x.flowKey === this.props.batchData.riverAlt );
    let steps = new Set();
    if(flow) {
      for(let s of flow.flow) {
        s.type !== 'finish' ? steps.add(s) : null;
      }
    }else{null}
    if(flowAlt) {
      for(let as of flowAlt.flow) {
        as.type !== 'finish' ? steps.has({key: as.key}) ? null : steps.add(as) : null;
      }
    }else{null}
    let niceSteps = [...steps].filter( ( v, indx, slf ) => slf.findIndex( x => x.key === v.key ) === indx);
    return niceSteps;
  }
  
  advancedFilter() {
    filtrA = [];
    for(let z of this.props.batchData.items) {
      const match = z.history.find( x => x.key === this.state.advancedKey && x.good === true );
      !match ? null : filtrA.push(z.serial);
    }
    return filtrA;
  }

  render() {
    
    const b = this.props.batchData;
    
    const scrap = b ? this.scraps() : [];
    
    const steps = this.flowSteps();
    
    const matchList = this.advancedFilter();
    
    const f = this.state.filter;
    let preFilter = 
      f === 'done' ?
      b.items.filter( x => x.finishedAt !== false ) :
      f === 'inproc' ?
      b.items.filter( x => x.finishedAt === false ) :
      f === 'alt' ?
      b.items.filter( x => x.alt === 'yes' ) :
      f === 'rma' ?
      b.items.filter( x => x.rma.length > 0) :
      f === 'scrap' ?
      b.items.filter( x => scrap.includes(x.serial) === true ) :
      b.items;
      
    let showList = this.state.advancedKey ?
                   preFilter.filter( z => matchList.includes(z.serial) === true )
                   :
                   preFilter;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
        
          <FilterItems
            title={b.batch}
            total={showList.length}
            advancedTitle='Step'
            advancedList={steps}
            onClick={e => this.setFilter(e)}
            onChange={e => this.setAdvancedFilter(e)} />
        
          {showList.map( (entry, index)=> {
            let style = entry.history.length === 0 ? 'jumpBar' :
                        entry.finishedAt === false ? 'jumpBar activeMark' : 
                        scrap.includes(entry.serial) ? 'jumpBar ngMark' : 'jumpBar gMark';
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