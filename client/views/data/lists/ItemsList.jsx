import React, { useState, useEffect } from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterItems from '/client/components/bigUi/FilterItems.jsx';

const ItemsList = (props)=> {
  
  const [ stateList, setList ] = useState([]);
  const [ keyword, setKeyword ] = useState(false);
  const [ timeModifyer, setTime ] = useState(false);
  const [ notModifyer, setMod ] = useState(false);
  
  useEffect( ()=> {
    let el = document.getElementById('exItemList');
    const pos = Session.get('itemListScrollPos') || {b: false, num: 0};
    if(props.batchData.batch === pos.b) { el.scrollTop = pos.num || 0 }
  }, []);
  
  // update filter state
  function setKeywordFilter(keyword) { setKeyword( keyword.toLowerCase() ); }
  function setTimeFilter(rule) { setTime( rule ); }
  function setToggle(rule) { setMod( rule ); }
  
  // get flow steps for menu
  function flowSteps() {
    let flow = props.widgetData.flows.find( x => x.flowKey === props.batchData.river );
    let flowAlt = props.widgetData.flows.find( x => x.flowKey === props.batchData.riverAlt );
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
  function fDone(items, timeMod, notMod) {
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
  
  function fInproc(items, timeMod, notMod) {
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
  
  function fFirsts(items, timeMod, notMod) {
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
  
  function fNoncons(items, nonCon, timeMod, notMod) {
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
  
  function fShortfalls(items, short, timeMod, notMod) {
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
  
  function fAlt(items, notMod) {
    if(notMod === true) {
      return items.filter( x => x.alt === 'no' );
    }else{
      return items.filter( x => x.alt === 'yes' );
    }
  }
  
  function fRma(items, notMod) {
    if(notMod === true) {
      return items.filter( x => x.rma.length === 0);
    }else{
      return items.filter( x => x.rma.length > 0);
    }
  }
  
  function fScrap(items, timeMod, notMod) {
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
  
  
  function fStep(items, flowKey, timeMod, notMod) {
    const key = flowKey.slice(1);
    let filtered = [];
    if(!flowKey) {
      filtered = items;
    }else if(!timeMod || timeMod === '') {
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.key === key && y.good === true )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.key === key && y.good === true )
                    .length > 0 );
      }
    }else{
      if(notMod === true) {
        filtered = items.filter( 
                    x => x.history.filter( y => y.key === key && y.good === true &&
                      moment(moment(y.time).format('YYYY-MM-DD'))
                        .isSame(timeMod, 'day') )
                      .length === 0 );
      }else{
        filtered = items.filter( 
                  x => x.history.filter( y => y.key === key && y.good === true &&
                    moment(moment(y.time).format('YYYY-MM-DD'))
                      .isSame(timeMod, 'day') )
                    .length > 0 );
      }
    }
    return filtered;                                 
  }
    
  const b = props.batchData;
  const nonCon = b.nonCon;
  const short = b.shortfall || [];
  
  const scrap = b ? fScrap(b.items, timeModifyer, notModifyer) : 
                    { scrapList: [], iList: [] };
  
  const steps = flowSteps();
   
  useEffect( ()=> { 
    const K = keyword;
    
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({ K, timeModifyer, notModifyer });
    
    let filteredList = 
    !K ?
      b.items :
    K.startsWith('@') ?
      fStep(b.items, K, timeModifyer, notModifyer) :
    K === 'complete' ?
      fDone(b.items, timeModifyer, notModifyer) :
    K === 'in progress' ?
      fInproc(b.items, timeModifyer, notModifyer) :
    K === 'first offs' ?
      fFirsts(b.items, timeModifyer, notModifyer) :
    K === 'nonconformances' ?
      fNoncons(b.items, nonCon, timeModifyer, notModifyer) :
    K === 'shortfalls' ?
      fShortfalls(b.items, short, timeModifyer, notModifyer) :
    K === 'alternative' ?
      fAlt(b.items, notModifyer) :
    K === 'rma' ?
      fRma(b.items, notModifyer) :
    K === 'scrap' ? 
      scrap.iList :
    b.items;

    let showListOrder = filteredList.sort( (x,y)=> x.serial - y.serial);
    
    setList(showListOrder);
  }, [ keyword, timeModifyer, notModifyer ]);

  return (
    
      <div className='' key={1}>
        <FilterItems
          title={b.batch}
          total={stateList.length}
          advancedList={steps}
          selectedKeyword={keyword}
          selectedToggle={notModifyer}
          onKeywordChange={e => setKeywordFilter(e)}
          onTimeChange={e => setTimeFilter(e)}
          onNotChange={e => setToggle(e)} />
        {stateList.map( (entry, index)=> {
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
};

export default ItemsList;