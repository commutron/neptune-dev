import React from 'react';
import moment from 'moment';

function flowLoop(river, items) {
  const now = moment().format();
  const wndw = (t)=>moment(t).isSame(now, 'day');
  const byKey = (t, ky)=> { return ( k => k.key === ky )};
  
  const firsts = Array.from( items, 
                  x => x.history.filter( 
                    y => y.type === 'first') );
  const firstsFlat = [].concat(...firsts);
      
  let stepsData = [];
  for(let step of river) {
    
    if(step.type === 'first') {
      
      //const goodFirst = firstsFlat.filter( f => f.key === step.key && f.good === true );
      const goodFirst = firstsFlat.find( f => f.key === step.key && f.good === true );
      //const ngFirst = firstsFlat.filter( f => f.key === step.key && f.good !== true );
      const ngFirst = firstsFlat.find( f => f.key === step.key && f.good !== true );
      
      stepsData.push({
        obj: 'ping',
        key: step.key,
        step: step.step,
        type: step.type,
        goodFirst: !goodFirst ? false : true,
        ngFirst: !ngFirst ? false : true,
      });
      
    }else{
      
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
        }else{
          h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
        }
        hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
      }
    
      stepsData.push({
        obj: 'tally',
        key: step.key,
        step: step.step,
        type: step.type,
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
      o => o.history.filter( 
        s => s.type === 'scrap' && s.good === true ).length === 0 )
  );
}
    
function ProgressCounter(flow, flowAlt, batchData) {
  //const rSteps = flow.filter( r => r.type !== 'first' );
  //const aSteps = flowAlt.filter( a => a.type !== 'first' );
  
  const allItems = batchData.items;
  
  const allLiveItems = outScrap(allItems);
  const scrapCount = allItems.length - allLiveItems.length;
  
  let regItems = allLiveItems;
  let altItems = [];
  
  if(flowAlt.length > 0) {
    regItems = allLiveItems.filter( r => r.alt === 'no' || r.alt === false );
    altItems = allLiveItems.filter( a => a.alt === 'yes' );
  }else{null}
  
  const totalRegUnits = unitTotalCount(regItems);
  const totalAltUnits = unitTotalCount(altItems);
      
  const regStepData = flowLoop(flow, regItems);
  const altStepData = flowLoop(flowAlt, altItems);

  return {
    regStepData: regStepData,
    regItems: regItems.length,
    altStepData: altStepData,
    altItems: altItems.length,
    totalRegUnits: totalRegUnits,
    totalAltUnits: totalAltUnits,
    scrapCount: scrapCount
  };
}

export default ProgressCounter;