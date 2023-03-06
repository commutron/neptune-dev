import React from 'react';
// import moment from 'moment';
import { avgOfArray } from '/client/utility/Convert';
import { countWaterfall } from '/client/utility/Arrays';
  
function flowLoop(river, items, firstsFlat, wndw) {
  const byKey = (t, ky)=> { return ( k => k.key === ky && k.good === true )};
  
  const doneItems = items.filter( x => x.completed );
  const wipItems = items.filter( x => !x.completed && x.history.length > 0 );
      
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
      let itemPassd = 0;
      let unitPassd = 0;
      
      for(var dix = doneItems.length-1; dix>=0; dix--){
        const di = doneItems[dix];
        // itemCount += 1;
        // unitCount += di.units;
        
        di.history.find( byKey(this, step.key) ) ? 
                          (itemCount += 1, unitCount += di.units ) : 
                          (itemPassd += 1, unitPassd += di.units );
        
        const hNew = di.history.filter( q => wndw(q.time) === true && q.good === true );
        hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += di.units ) : null;
      }
      
      for(var wix = wipItems.length-1; wix>=0; wix--){
        const wi = wipItems[wix];
        
        wi.history.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += wi.units ) : null;
        
        const hNew = wi.history.filter( q => wndw(q.time) === true && q.good === true );
        hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += wi.units ) : null;
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
        unitsNew: unitCountNew,
        itemPassd: itemPassd,
        unitPassd: unitPassd
      });
    }
  } 
  return stepsData;
}

function unitTotalCount(items) {
  const count = items.length > 0 ? items.reduce((t,i)=> t + i.units, 0) : 0;
  return count;
}

function outScrap(items) { 
  return items.filter( o => !o.scrapped );
}

function getFirsts(items) { 
  const firsts = Array.from( items, 
                  x => x.history.filter( y => y.type === 'first') );
  const fFlat = [].concat(...firsts);
  return fFlat;
}
    
function FlowCounter(flow, seriesData) {
  const srsItems = seriesData && Array.isArray(seriesData.items) ? seriesData.items : [];
  
  // const now = moment().format();
  // const wndw = (t)=>moment(t).isSame(now, 'day');
  const now = new Date().toDateString();
  const wndw = (t)=> new Date(t).toDateString() === now;
  
  const allLiveItems = outScrap(srsItems);
  const scrapCount = srsItems.length - allLiveItems.length;
  
  const firstsFlat = getFirsts(allLiveItems);
  
  const stndItems = allLiveItems.filter( i => i.altPath.every( a => !a.river ) );
  const althItems = allLiveItems.filter( i => i.altPath.some( a => a.river !== false ) );
  
  const liveUnits = unitTotalCount(stndItems);
  const altUnits = unitTotalCount(althItems);
  
  const altDone = althItems.filter( x => x.completed ).length;
  const altDoneNew = althItems.filter( x => x.completed && wndw(x.completedAt) ).length;
  
  const allFlow = srsItems.length === 0 ||
                  srsItems.length > 0 && srsItems.every( x => x.completed );

  const riverProg = flowLoop(flow, stndItems, firstsFlat, wndw);
  
  return {
    riverProg: riverProg,
    liveItems: stndItems.length,
    liveUnits: liveUnits,
    altDone: altDone,
    altDoneNew: altDoneNew,
    altItems: althItems.length,
    altUnits: altUnits,
    firstsFlat: firstsFlat,
    scrapCount: scrapCount,
    allFlow: allFlow
  };
}

export default FlowCounter;


export function FallCounter(batchData) {
  const waterfall = batchData.waterfall;
  const quantity = batchData.quantity;
  
  let countData = [];
  let doneCheck = [];
  for(let wf of waterfall) {
    const wfType = wf.type;
    const wfCount = countWaterfall(wf.counts);
    
    const now = new Date().toDateString();
    let fresh = wf.counts.filter( t=> new Date(t.time).toDateString() === now );
    const nwCount = countWaterfall(fresh);
    const topNum = wf.action === 'slider' ? 100 : quantity;
    
    doneCheck.push( wfCount === topNum );
    countData.push({
      obj: 'count',
      wfKey: wf.wfKey,
      step: wf.gate,
      type: wfType,
      bKey: wf.branchKey,
      action: wf.action,
      pos: wf.position || 0,
      count: wfCount,
      countNew: nwCount
    });
  }
  const fallCounts = countData.sort((w1, w2)=> w1.pos < w2.pos ? -1 : w1.pos > w2.pos ? 1 : 0 );
  return {
    fallProg: fallCounts,
    allFall: doneCheck.length === 0 ? true :
      doneCheck.length > 0 && doneCheck.every( x => x === true )
  };
}
  
export function WhiteWaterCounter(rapidData, seriesData) {
  const totalQ = rapidData.quantity;
  const now = new Date().toDateString();

  let countArr = [];
  let pointArr = [];
  let newptArr = [];
  let iSet = 0;
  let iDone = null;
  let iNew = null;
  let nFin = null;
  
  const fallS = rapidData.cascade.sort((w1, w2)=> 
          w1.position < w2.position ? -1 : w1.position > w2.position ? 1 : 0 );
  
  for(let wf of fallS) {
    const wfCount = countWaterfall(wf.counts);
    countArr.push(wfCount);
    pointArr.push( wfCount / totalQ );
    
    let fresh = wf.counts.filter( t=> new Date(t.time).toDateString() === now );
    newptArr.push( countWaterfall(fresh) / totalQ );
  }
  
  if(rapidData.extendBatch && seriesData) {
    
    const rapSetI = seriesData.items.filter( i => 
                      i.altPath.find( r => r.rapId === rapidData._id ) );
    iSet = rapSetI.length;
    
    const rapDidI = rapSetI.filter( i => i.altPath.find( r => 
                      r.rapId === rapidData._id && r.completed === true ) 
                    ).length;
    iDone = ( rapDidI / totalQ );
    
    const rapNewI = rapSetI.filter( i => i.altPath.find( r => 
                      r.rapId === rapidData._id && r.completed === true &&
                      new Date(r.completedAt).toDateString() === now ) 
                    ).length;
    iNew = ( rapNewI / totalQ );
    nFin = [ rapDidI, rapNewI ];
  }
  
  const pointProgress = avgOfArray([...pointArr,iDone]);
  const freshProgress = avgOfArray([...newptArr,iNew]);
  
  return [ iSet, pointProgress, countArr, freshProgress, nFin ];
}