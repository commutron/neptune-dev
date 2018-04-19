import React from 'react';
import moment from 'moment';

function flowLoop(river, items, expand, quotaStart) {
  const now = moment().format();
  const wndw = !quotaStart ? (t)=>moment(t).isSame(now, 'day') : 
                              (t)=>moment(t).isBetween(quotaStart, now);
  const byKey = (t, ky)=> { return ( k => k.key === ky )};
  const byName = (t, nm)=> { return ( s => s.step === nm && s.type === 'first' )};
  let stepCounts = [];
  for(let step of river) {
    let itemCount = 0;
    let unitCount = 0;
    let itemCountNew = 0;
    let unitCountNew = 0;
    
    for(var i of items) {
      const h = i.history.filter( g => g.good === true);
      const hNew = h.filter( q => wndw(q.time) === true );
      if(i.finishedAt !== false) {
        itemCount += 1;
        unitCount += 1 * i.units;
        if(expand) {
          if(hNew.find( f => f.key === 'f1n15h1t3m5t3p' )) {
            itemCountNew += 1;
            unitCountNew += 1 * i.units;
          }
        }
      }else if(step.type === 'inspect') {
        h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
        h.find( byName(this, step.step) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
        if(expand) {
          hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
          hNew.find( byName(this, step.step) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
        }
      }else{
        h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
        if(expand) {
          hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
        }
      }
    }
    stepCounts.push({
      key: step.key,
      step: step.step,
      type: step.type,
      items: itemCount,
      units: unitCount,
      itemsNew: itemCountNew,
      unitsNew: unitCountNew
    });
  } 
  return stepCounts;
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
      o => o.history.filter( 
        s => s.type === 'scrap' ).length === 0 )
  );
}
    
function ProgressCounter(flow, flowAlt, batchData, expand) {
  const rSteps = flow.filter( r => r.type !== 'first' );
  const aSteps = flowAlt.filter( a => a.type !== 'first' );
  
  const allItems = batchData.items;
  
  const allLiveItems = outScrap(allItems);
  const scrapCount = allItems.length - allLiveItems.length;
  
  let regItems = allLiveItems;
  let altItems = [];
  
  if(aSteps.length > 0) {
    regItems = allLiveItems.filter( r => r.alt === 'no' || r.alt === false );
    altItems = allLiveItems.filter( a => a.alt === 'yes' );
  }else{null}
  
  const totalRegUnits = unitTotalCount(regItems);
  const totalAltUnits = unitTotalCount(altItems);

  const regStepCounts = flowLoop(rSteps, regItems, expand, false);
  const altStepCounts = flowLoop(aSteps, altItems, expand, false);

  return {
    regStepCounts: regStepCounts,
    regItems: regItems.length,
    altStepCounts: altStepCounts,
    altItems: altItems.length,
    totalRegUnits: totalRegUnits,
    totalAltUnits: totalAltUnits,
    scrapCount: scrapCount
  };
}

export default ProgressCounter;