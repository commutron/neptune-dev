import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
//import Pref from '/client/global/pref.js';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterItems from '/client/components/bigUi/FilterItems.jsx';

const ItemsList = ({ 
  batchData, widgetData, flowData,
  orb, isDebug
})=> {
  
  const sessionSticky = batchData.batch + 'batchItemFilter' ;
  
  const [ stateList, setList ] = useState([]);
  const [ keyword, setKeyword ] = useState( Session.get(sessionSticky+'keyword') || false);
  const [ timeModifyer, setTime ] = useState( Session.get(sessionSticky+'time') || false);
  const [ notModifyer, setMod ] = useState( Session.get(sessionSticky+'toggle') || false);

  // update filter state
  function setKeywordFilter(keyword) {
    setKeyword( keyword );
    Session.set((sessionSticky+'keyword'), keyword);
  }
  function setTimeFilter(rule) { 
    setTime( rule );
    Session.set((sessionSticky+'time'), rule);
  }
  function setToggle(rule) { 
    setMod( rule );
    Session.set((sessionSticky+'toggle'), rule);
  }
  
  // get flow steps for menu
  function flowSteps() {
    let steps = new Set();
    if(flowData.riverFlow) {
      for(let s of flowData.riverFlow) {
        steps.add(s);
      }
    }else{null}
    if(flowData.riverFlowAlt) {
      for(let as of flowData.riverFlowAlt) {
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
        v.type === 'scrap' && v.good === true ? 
        scrapList.push(entry.serial) : null;
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
    
  const b = batchData;
  const nonCon = b.nonCon;
  const short = b.shortfall || [];
  
  const scrap = b ? fScrap(b.items, timeModifyer, notModifyer) : 
                    { scrapList: [], iList: [] };
  
  const steps = flowSteps();
   
  useEffect( ()=> { 
    const K = keyword;
    
    isDebug && console.log({ K, timeModifyer, notModifyer });
    
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
  }, [ batchData, keyword, timeModifyer, notModifyer ]);
  
  const bttnClss = 'leapBar numFont blackblack';
  
  return(
    <Fragment>
      <FilterItems
        title={b.batch}
        total={stateList.length}
        advancedList={steps}
        selectedKeyword={keyword}
        selectedTime={timeModifyer}
        selectedToggle={notModifyer}
        onKeywordChange={e => setKeywordFilter(e)}
        onTimeChange={e => setTimeFilter(e)}
        onNotChange={e => setToggle(e)} />
      {stateList.map( (entry, index)=> {
        let style = entry.history.length === 0 ? bttnClss :
                    entry.finishedAt === false ? `${bttnClss} activeMark` : 
                    scrap.scrapList.includes(entry.serial) ? `${bttnClss} ngMark` : `${bttnClss} gMark`;
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
		</Fragment>
  );
};

export default ItemsList;