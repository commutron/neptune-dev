import React from 'react';
import moment from 'moment';
import { round2Decimal, avgOfArray } from '/client/utility/Convert';


function flowLoop(river, items, firstsFlat) {
  const now = moment().format();
  const wndw = (t)=>moment(t).isSame(now, 'day');
  const byKey = (t, ky)=> { return ( k => k.key === ky && k.good === true )};
      
  let stepsData = [];
  for( let [index, step] of river.entries()) {
    
    if(step.type === 'first') {
      const goodFirst = firstsFlat.find( f => f.key === step.key && f.good === true );
      const ngFirst = firstsFlat.find( f => f.key === step.key && f.good !== true );
      
      stepsData.push({
        obj: 'ping',
        key: step.key,
        step: step.step,
        type: step.type,
        bKey: step.branchKey,
        goodFirst: !goodFirst ? false : true,
        ngFirst: !ngFirst ? false : true,
      });
      
    }else{
      
      let itemCount = 0;
      let unitCount = 0;
      let itemCountNew = 0;
      let unitCountNew = 0;
      
      for(var ix = items.length-1; ix>=0; ix--){
        const i = items[ix];
        const hNew = i.history.filter( q => wndw(q.time) === true && q.good === true );
        if(i.completed) {
          itemCount += 1;
          unitCount += i.units;
        }else{
          i.history.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += i.units ) : null;
        }
        hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += i.units ) : null;
      }
    
      stepsData.push({
        obj: 'tally',
        key: step.key,
        step: step.step,
        type: step.type,
        bKey: step.branchKey,
        pos: index,
        items: itemCount,
        units: unitCount,
        itemsNew: itemCountNew,
        unitsNew: unitCountNew
      });
    }
  } 
  return stepsData;
}


function unitTotalCount(items) {
  let totalUnits = 0;
  for(let i of items) {
    totalUnits += i.units;
  }
  return totalUnits;
}

function outScrap(items) { 
  return ( 
    items.filter( 
      o => o.history.findIndex( 
        s => s.type === 'scrap' && s.good === true ) === -1 )
  );
}

function getFirsts(items) { 
  const firsts = Array.from( items, 
                  x => x.history.filter( 
                    y => y.type === 'first') );
  const fFlat = [].concat(...firsts);
  return fFlat;
}
    
function FlowCounter(flow, seriesData) {
  
  const flowSeries = seriesData && flow.length > 0;
  const allItems = flowSeries ? seriesData.items : [];
  
  const allLiveItems = outScrap(allItems);
  const scrapCount = allItems.length - allLiveItems.length;
  
  const firstsFlat = getFirsts(allLiveItems);
  
  const stndItems = allLiveItems.filter( i => i.altPath.every( a => !a.river ) );
  const althItems = allLiveItems.filter( i => i.altPath.some( a => a.river !== false ) );
  
  const liveUnits = unitTotalCount(stndItems);
  const altUnits = unitTotalCount(althItems);
  
  const altDone = althItems.filter( x => x.completed ).length;
  
  const riverProg = flowLoop(flow, stndItems, firstsFlat);
  
  const allFlow = !flowSeries ? true :
          allItems.length > 0 && allItems.every( x => x.completed );

  return {
    riverProg: riverProg,
    liveItems: stndItems.length,
    liveUnits: liveUnits,
    altDone: altDone,
    altItems: althItems.length,
    altUnits: altUnits,
    firstsFlat: firstsFlat,
    scrapCount: scrapCount,
    allFlow: allFlow
  };
}

export default FlowCounter;


function fallLoop(waterfall, quantity) {
  let countData = [];
  let doneCheck = [];
  for(let wf of waterfall) {
    const wfType = wf.type;
    const wfCount = wf.counts.length === 0 ? 0 :
                      Array.from(wf.counts, x => x.tick).reduce((x,y)=> x + y);
    doneCheck.push( wfCount === quantity );
    countData.push({
      obj: 'count',
      wfKey: wf.wfKey,
      step: wf.gate,
      type: wfType,
      bKey: wf.branchKey,
      action: wf.action,
      pos: wf.position || 0,
      count: wfCount
    });
  }
  const fallCounts = countData.sort((w1, w2)=> 
                              w1.pos < w2.pos ? -1 : w1.pos > w2.pos ? 1 : 0 );
  return {
    fallProg: fallCounts,
    allFall: doneCheck.length === 0 ? true :
      doneCheck.length > 0 && doneCheck.every( x => x === true )
  };
}

export function FallCounter(batchData) {
  
  const wtrflProg = fallLoop(batchData.waterfall, batchData.quantity);

  return wtrflProg;
}


  
export function WhiteWaterCounter(rapidData, seriesData) {
  const totalQ = rapidData.quantity;
  
  let countArr = [];
  let pointArr = [];
  let iSet = 0;
  let iDone = null;
  
  const fallS = rapidData.cascade.sort((w1, w2)=> 
          w1.position < w2.position ? -1 : w1.position > w2.position ? 1 : 0 );
  
  for(let wf of fallS) {
    const wfCount = wf.counts.length === 0 ? 0 :
                      Array.from(wf.counts, x => x.tick).reduce((x,y)=> x + y);
    countArr.push(wfCount);
    const point = ( wfCount / totalQ );
    pointArr.push(point);
  }
  
  if(rapidData.extendBatch && seriesData) {
    
    const rapSetI = seriesData.items.filter( i => 
                      i.altPath.find( r => r.rapId === rapidData._id ) );
    iSet = rapSetI.length;
    
    const rapDidI = rapSetI.filter( i => 
                      i.altPath.find( r => 
                        r.rapId === rapidData._id && r.completed === true ) 
                    ).length;
    iDone = ( rapDidI / totalQ );
  }
  
  const pointProgress = round2Decimal( avgOfArray([...pointArr,iDone]) );
  
  return [ iSet, pointProgress, countArr ];
}


// Other Methods \\

/*
  riverStepSelfCount(itemsCol) {
    const itemHistory = Array.from( itemsCol, x => 
              x.history.filter( y => 
                y.type !== 'first' && y.type !== 'scrap' && y.good === true) );
    
    const itemHkeys = Array.from( itemHistory, x => x.map( s => 
                                      `${s.key}<|>${s.step}<|>${s.type}` ) );
    
    const keysFlat = [].concat(...itemHkeys);
    const keyObj = _.countBy(keysFlat, x => x);
    const itr = Object.entries(keyObj);

    const keyArr = Array.from(itr, (a)=> ( {keystep: a[0], count: a[1]} ) );
    return keyArr;
  },
*/