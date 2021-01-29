import React from 'react';
import moment from 'moment';

// ALT PATH HANDLING !! \\

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
  
  const allItems = seriesData ? seriesData.items : [];
  
  const allLiveItems = outScrap(allItems);
  const scrapCount = allItems.length - allLiveItems.length;
  
  const liveUnits = unitTotalCount(allLiveItems);
  
  const firstsFlat = getFirsts(allLiveItems);
  
  const riverProg = flowLoop(flow, allLiveItems, firstsFlat);

  return {
    riverProg: riverProg,
    liveItems: allLiveItems.length,
    liveUnits: liveUnits,
    firstsFlat: firstsFlat,
    scrapCount: scrapCount
  };
}

export default FlowCounter;


function fallLoop(waterfall, app) {
  let countData = [];
  const appCO = app.countOption;
  for(let wf of waterfall) {
    const wfType = wf.type || appCO.find( x => x.key === wf.wfKey ).type;
    const wfCount = wf.counts.length === 0 ? 0 :
                      Array.from(wf.counts, x => x.tick).reduce((x,y)=> x + y);
    countData.push({
      obj: 'count',
      key: wf.wfKey,
      step: wf.gate,
      type: wfType,
      bKey: wf.branchKey,
      pos: wf.position || 0,
      count: wfCount
    });
  }
  return countData;
}

export function FallCounter(batchData, app) {
  
  const wtrflProg = fallLoop(batchData.waterfall, app);

  return wtrflProg;
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