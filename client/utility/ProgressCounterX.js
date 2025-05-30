import React from 'react';
import { avgOfArray } from '/client/utility/Convert';
import { countWaterfall } from '/client/utility/Arrays';
  
function flowLoop(river, items, firstsFlat, wndw) {
  const findKey = (t, history, ky)=> {
    const i = history.findIndex( h => h.key === ky && h.good === true );
    return i === -1 ? false : wndw(history[i].time) ? 'FRESH' : true;
  };
  
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
      
      for(var ix = items.length-1; ix>=0; ix--){
        const item = items[ix];
        
        if(item.completed) {
          
          const dchk = findKey(this, item.history, step.key);
          dchk ? (itemCount += 1, unitCount += item.units ) : 
                 (itemPassd += 1, unitPassd += item.units );
          dchk === "FRESH" && (itemCountNew += 1, unitCountNew += item.units);
          
        }else if(item.history.length > 0) {
          
          const wchk = findKey(this, item.history, step.key);
          wchk && (itemCount += 1, unitCount += item.units );
          wchk === "FRESH" && (itemCountNew += 1, unitCountNew += item.units);
        
        }else{
          continue;
        }
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
  return items.reduce((t,i)=> t + i.units, 0);
}

function outScrap(items) { 
  return items.filter( o => !o.scrapped );
}

function getFirsts(items) { 
  return [].concat(...Array.from( items, x => x.history.filter( y => y.type === 'first') ) );
}
    
function FlowCounter(flow, seriesData) {
  const srsItems = seriesData?.items || [];
  
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