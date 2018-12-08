import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterItems from '../../../components/bigUi/FilterItems.jsx';

export default class ItemsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false,
      advancedKey: false,
      advancedTime: false,
      textString: ''
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
  }
  setStepFilter(rule) {
    let realRule = rule === 'false' ? false : rule;
    this.setState({ advancedKey: realRule });
  }
  setTimeFilter(rule) {
    this.setState({ advancedTime: rule });
  }
  setTextFilter(rule) {
    this.setState({ textString: rule.toLowerCase() });
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
        steps.add(s);
      }
    }else{null}
    if(flowAlt) {
      for(let as of flowAlt.flow) {
        steps.has({key: as.key}) ? null : steps.add(as);
      }
    }else{null}
    let niceSteps = [...steps].filter( ( v, indx, slf ) => slf.findIndex( x => x.key === v.key ) === indx);
    return niceSteps;
  }

  advancedStepFilter() {
    let filtrA = [];
    for(let z of this.props.batchData.items) {
      let match = false;
      if(this.state.advancedKey == false) {
        match = true;
      }else{
        match = z.history.find( x => x.key === this.state.advancedKey );
      }
      !match ? null : filtrA.push(z.serial);
    }
    return filtrA;
  }
  
  advancedTimeFilter() {
    let filtrA = [];
    for(let z of this.props.batchData.items) {
      let match = false;
      if(!this.state.advancedTime || this.state.advancedTime === '') {
        match = true;
      }else if(this.state.filter === 'noncons') {
        match = this.props.batchData.nonCon.find( x => x.serial === z.serial &&
                  moment(moment(x.time).format('YYYY-MM-DD'))
                    .isSame(this.state.advancedTime, 'day') === true );
      }else{
        match = z.history.find( x =>
                  moment(moment(x.time).format('YYYY-MM-DD'))
                    .isSame(this.state.advancedTime, 'day') === true );
      }
      !match ? null : filtrA.push(z.serial);
    }
    return filtrA;
  }
  
  render() {
    
    const filter = this.state.filter;
    const advancedKey = this.state.advancedKey;
    const advancedTime = this.state.advancedTime;
    const textString = this.state.textString;
      
    const b = this.props.batchData;
    const short = b.shortfall || [];
    
    const scrap = b ? this.scraps() : [];
    
    const steps = this.flowSteps();
    
    const matchStep = this.advancedStepFilter();
    
    const matchTime = this.advancedTimeFilter();
    
    const f = filter;
    let preFilter = 
      f === 'done' ?
      b.items.filter( x => x.finishedAt !== false ) :
      f === 'inproc' ?
      b.items.filter( x => x.finishedAt === false ) :
      f === 'firsts' ?
      b.items.filter( x => x.history.find( y => y.type === 'first') ) :
      f === 'noncons' ?
      b.items.filter( x => b.nonCon.find( y => y.serial === x.serial ) )  :
      f === 'shortfalls' ?
      b.items.filter( x => short.find( y => y.serial === x.serial ) )  :
      f === 'alt' ?
      b.items.filter( x => x.alt === 'yes' ) :
      f === 'rma' ?
      b.items.filter( x => x.rma.length > 0) :
      f === 'scrap' ?
      b.items.filter( x => scrap.includes(x.serial) === true ) :
      b.items;
    
    let textFilter = preFilter.filter( 
                      tx => tx.serial.toLowerCase().includes(textString) === true );
                      
    let stepFilter = advancedKey == false ? textFilter :
                      textFilter.filter( z => matchStep.includes(z.serial) === true );
                         
    let timeFilter = !advancedTime || advancedTime == '' ? stepFilter :
                      stepFilter.filter( z => matchTime.includes(z.serial) === true );
                      
    let showListOrder = timeFilter.sort( (x,y)=> x.serial - y.serial);

    return (
      <AnimateWrap type='cardTrans'>
        <div className='' key={1}>
          <div className='stickyBar'>
            <FilterItems
              title={b.batch}
              total={showListOrder.length}
              advancedList={steps}
              onClick={e => this.setFilter(e)}
              onStepChange={e => this.setStepFilter(e)}
              onTimeChange={e => this.setTimeFilter(e)}
              onTxtChange={e => this.setTextFilter(e)} />
          </div>
          {showListOrder.map( (entry, index)=> {
            let style = entry.history.length === 0 ? 'leapBar numFont' :
                        entry.finishedAt === false ? 'leapBar numFont activeMark' : 
                        scrap.includes(entry.serial) ? 'leapBar numFont ngMark' : 'leapBar numFont gMark';
              return (
                <LeapButton
                  key={index} 
                  title={entry.serial} 
                  sub='' 
                  sty={style}
                  address={'/data/batch?request=' + b.batch + '&specify=' + entry.serial}
                />
              );
          })}
  			</div>
			</AnimateWrap>
    );
  }
}