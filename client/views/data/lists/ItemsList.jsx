import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterItems from '../../../components/bigUi/FilterItems.jsx';

export default class ItemsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      keyword: false,
      timeModifyer: false,
      notModifyer: false
    };
  }
  
  // Set scroll position from stored
  componentDidMount() {
    let el = document.getElementById('exItemList');
    const pos = Session.get('itemListScrollPos') || {b: false, num: 0};
    if(this.props.batchData.batch === pos.b) { el.scrollTop = pos.num || 0 }
  }
  
  // update filter state
  setKeywordFilter(keyword) { this.setState({ keyword: keyword.toLowerCase() }); }
  setTimeFilter(rule) { this.setState({ timeModifyer: rule }); }
  setToggle(rule) { this.setState({ notModifyer: rule }); }
  
  // get flow steps for menu
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
    let niceSteps = [...steps]
    // remove duplicate 'finish' step
      .filter( ( v, indx, slf ) => slf.findIndex( x => x.key === v.key ) === indx);
    return niceSteps;
  }

  // Sort Filters
  fDone(items, timeMod, notMod) {
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        return items.filter( x => x.finishedAt === false );
      }else{
        return items.filter( x => x.finishedAt !== false );
      }
    }else{
      if(notMod === true) {
        return items.filter( x => x.finishedAt === false ||
                !moment(moment(x.finishedAt).format('YYYY-MM-DD'))
                  .isSame(timeMod, 'day') );
      }else{
        return items.filter( x => x.finishedAt !== false &&
                moment(moment(x.finishedAt).format('YYYY-MM-DD'))
                  .isSame(timeMod, 'day') );
      }
    }
  }
  
  fInproc(items, timeMod, notMod) {
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        return items.filter( x => x.finishedAt !== false );
      }else{
        return items.filter( x => x.finishedAt === false );
      }
    }else{
      if(notMod === true) {
        return items.filter( x => x.finishedAt !== false ||
                moment(moment(x.createdAt).format('YYYY-MM-DD'))
                  .isAfter(timeMod, 'day') );
      }else{
        return items.filter( x => x.finishedAt === false &&
                moment(moment(x.createdAt).format('YYYY-MM-DD'))
                  .isSameOrBefore(timeMod, 'day') );
      }
    }
  }
  
  fFirsts(items, timeMod, notMod) {
    let filtered = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.type === 'first' )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.type === 'first' )
                    .length > 0 );
      }
    }else{
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.type === 'first' &&
                      moment(moment(y.time).format('YYYY-MM-DD'))
                        .isSame(timeMod, 'day') )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.type === 'first' &&
                    moment(moment(y.time).format('YYYY-MM-DD'))
                      .isSame(timeMod, 'day') )
                    .length > 0 );
      }
    }
    return filtered; 
  }
  
  fNoncons(items, nonCon, timeMod, notMod) {
    let filtered = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => nonCon.filter( y => y.serial === x.serial )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => nonCon.filter( y => y.serial === x.serial )
                    .length > 0 );
      }
    }else{
      if(notMod === true) {
        filtered = items.filter( 
                    x => nonCon.filter( y => y.serial === x.serial &&
                      moment(moment(y.time).format('YYYY-MM-DD'))
                        .isSame(timeMod, 'day') )
                      .length === 0 );
      }else{
        filtered = items.filter(
                  x => nonCon.filter( y => y.serial === x.serial &&
                    moment(moment(y.time).format('YYYY-MM-DD'))
                      .isSame(timeMod, 'day') )
                    .length > 0 );
      }
    }
    return filtered;
  }
  
  fShortfalls(items, short, timeMod, notMod) {
    let filtered = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => short.filter( y => y.serial === x.serial )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => short.filter( y => y.serial === x.serial )
                    .length > 0 );
      }
    }else{
      if(notMod === true) {
        filtered = items.filter( 
                    x => short.filter( y => y.serial === x.serial &&
                      moment(moment(y.cTime).format('YYYY-MM-DD'))
                        .isSame(timeMod, 'day') )
                      .length === 0 );
      }else{
        filtered = items.filter(
                  x => short.filter( y => y.serial === x.serial &&
                    moment(moment(y.cTime).format('YYYY-MM-DD'))
                      .isSame(timeMod, 'day') )
                    .length > 0 );
      }
    }
    return filtered;
  }
  
  fAlt(items, notMod) {
    if(notMod === true) {
      return items.filter( x => x.alt === 'no' );
    }else{
      return items.filter( x => x.alt === 'yes' );
    }
  }
  
  fRma(items, notMod) {
    if(notMod === true) {
      return items.filter( x => x.rma.length === 0);
    }else{
      return items.filter( x => x.rma.length > 0);
    }
  }
  
  fScrap(items, timeMod, notMod) {
    let scrapList = [];
    items.map( (entry)=>{
      for(let v of entry.history) {
        v.type === 'scrap' ? scrapList.push(entry.serial) : null;
      }
    });
    let iList = [];
    if(!timeMod || timeMod === '') {
      if(notMod === true) {
        iList = items.filter( 
                    x => x.history.filter( y => y.type === 'scrap' )
                      .length === 0 );
      }else{
        iList = items.filter( 
                  x => x.history.filter( y => y.type === 'scrap' )
                    .length > 0 );
      }
    }else{
      if(notMod === true) {
        iList = items.filter( 
                    x => x.history.filter( y => y.type === 'scrap' &&
                      moment(moment(y.time).format('YYYY-MM-DD'))
                        .isSame(timeMod, 'day') )
                      .length === 0 );
      }else{
        iList = items.filter( 
                  x => x.history.filter( y => y.type === 'scrap' &&
                    moment(moment(y.time).format('YYYY-MM-DD'))
                      .isSame(timeMod, 'day') )
                    .length > 0 );
      }
    }
    return { scrapList, iList };
  }
  
  
  fStep(items, flowKey, timeMod, notMod) {
    const key = flowKey.slice(1);
    let filtered = [];
    if(!flowKey) {
      filtered = items;
    }else if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.key === key )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.key === key )
                    .length > 0 );
      }
    }else{
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.key === key &&
                      moment(moment(y.time).format('YYYY-MM-DD'))
                        .isSame(timeMod, 'day') )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.key === key &&
                    moment(moment(y.time).format('YYYY-MM-DD'))
                      .isSame(timeMod, 'day') )
                    .length > 0 );
      }
    }
    return filtered;                                 
  }
  
  render() {
    
    const kywrd = this.state.keyword;
    const timeModifyer = this.state.timeModifyer;
    const notModifyer = this.state.notModifyer;
    
    {Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({ kywrd, timeModifyer, notModifyer });}
      
    const b = this.props.batchData;
    const nonCon = b.nonCon;
    const short = b.shortfall || [];
    
    const scrap = b ? this.fScrap(b.items, timeModifyer, notModifyer) : 
                      { scrapList: [], iList: [] };
    
    const steps = this.flowSteps();
    
    ////////////////////////////////
    let filteredList = 
      !kywrd ?
        b.items :
      kywrd.startsWith('@') ?
        this.fStep(b.items, kywrd, timeModifyer, notModifyer) :
      kywrd === 'complete' ?
        this.fDone(b.items, timeModifyer, notModifyer) :
      kywrd === 'in progress' ?
        this.fInproc(b.items, timeModifyer, notModifyer) :
      kywrd === 'first offs' ?
        this.fFirsts(b.items, timeModifyer, notModifyer) :
      kywrd === 'nonconformances' ?
        this.fNoncons(b.items, nonCon, timeModifyer, notModifyer) :
      kywrd === 'shortfalls' ?
        this.fShortfalls(b.items, short, timeModifyer, notModifyer) :
      kywrd === 'alternative' ?
        this.fAlt(b.items, notModifyer) :
      kywrd === 'rma' ?
        this.fRma(b.items, notModifyer) :
      kywrd === 'scrap' ? 
        scrap.iList :
      //kywrd === typeof 'String' ?
        //b.items.filter( tx => tx.serial.toLowerCase().includes(textString) === true ) :
      b.items;
    /////////////////////////////////////
    
    let showListOrder = filteredList.sort( (x,y)=> x.serial - y.serial);

    return (
      
        <div className='' key={1}>
          <FilterItems
            title={b.batch}
            total={showListOrder.length}
            advancedList={steps}
            selectedKeyword={kywrd}
            selectedToggle={notModifyer}
            onKeywordChange={e => this.setKeywordFilter(e)}
            onTimeChange={e => this.setTimeFilter(e)}
            onNotChange={e => this.setToggle(e)} />
          {showListOrder.map( (entry, index)=> {
            let style = entry.history.length === 0 ? 'leapBar numFont' :
                        entry.finishedAt === false ? 'leapBar numFont activeMark' : 
                        scrap.scrapList.includes(entry.serial) ? 'leapBar numFont ngMark' : 'leapBar numFont gMark';
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
			
    );
  }
}