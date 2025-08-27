import moment from 'moment';

export function syncLocale(accessKey) {
  const app = AppDB.findOne({orgKey:accessKey}, 
                {fields:{'nonWorkDays':1,'workingHours':1,'shippingHours':1}});
  if( app ) { 
    moment.updateLocale('en', { 
      holidays: app.nonWorkDays,
      workinghours: app.workingHours,
      shippinghours: app.shippingHours
    });
  }
}
export function appValue(accessKey, onekey) {
  const app = AppDB.findOne({orgKey:accessKey},{fields:{[onekey]:1}});
  if( app ) { 
    return app[onekey];
  }else{
    return false;
  }
}

export function sortBranches(branches) {
  const brancheS = branches.sort((b1, b2)=>
            b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  return brancheS;
}

export function flattenHistory(itemArr, incFirst) {
  let wipItemHistory = [];
  for( let i of itemArr ) { 
    wipItemHistory.push( 
      incFirst ?
        i.history.filter( y => y.good === true)
      : i.history.filter( y => y.type !== 'first' && y.good === true)
    );
  }
  const historyFlat = [].concat(...wipItemHistory);

  return historyFlat;
}

export function countWaterfall(stepCounts) {
  if(!Array.isArray(stepCounts) || stepCounts.length === 0) {
    return 0;
  }else{
    const ticks = Array.from(stepCounts, x => x.tick);
    const total = ticks.reduce((x,y)=> x + y, 0);
    return total;
  }
}

export function allNCOptions() {
  let org = AppDB.findOne({orgKey: Meteor.user().orgKey});
  if(!org) {
    return [];
  }else{
    const ncTypesCombo = Array.from(org.nonConTypeLists, x => x.typeList);
    const ncTCF = [].concat(...ncTypesCombo,...org.nonConOption);

	  const flatTypeList = Array.from(ncTCF, x => 
	    typeof x === 'string' ? x : 
	    x.live === true && x.typeText
	  );
	  const flatTypeListClean = [...new Set( flatTypeList.filter( x => x !== false) ) ];
    return flatTypeListClean;
  }
}

export function countMulti(ncArr) {
  const count = ncArr.reduce((x,y)=> x + Number(y.multi || 1), 0);
  return count;
}
export function countMultiRefs(shArr) {
  const inst = Array.from(shArr, x => (Number(x.multi) || 1) * x.refs.length);
  const count = inst.reduce((x,y)=> x + y, 0);
  return count;
}

export function noIg() {
  const app = AppDB.findOne({},{fields:{internalID:1}});
  return app.internalID || 'n0ne';
  // const xg = GroupDB.findOne({internal: true},{fields:{'_id':1}});
  // return xg ? xg._id : 'n0ne';
}

export function getEst(widgetId, quantity, pTgt) {
  const wdjt = WidgetDB.findOne({ _id: widgetId });
  const perQ = !wdjt.quoteStats ? 0 : wdjt.quoteStats.stats.tidePerItemAvg;
  const mEst = perQ * quantity;
  
  let cEst = mEst;
  const abs = Math.abs(pTgt);
  const safe = abs && !isNaN(abs) && isFinite(abs) ? abs : 0;
  
  // console.time('getEst_run_time');
  for(let x = safe; x > 0; x--) { 
    if(pTgt < 0) {
      cEst = cEst + ( mEst * 0.15 );
    }else{
      cEst = cEst - ( cEst * 0.15 ); 
    }
  }
  // console.timeEnd('getEst_run_time');
  return cEst;
}

export function toCap(str, all) {
  if(typeof str === 'string') {
    if(all) {
      return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }else{
      return str.trim().replace(/^\w/, (c) => c.toUpperCase());
    }
  }else{
    return "";
  }
}/* joshtronic of Digital Ocean Community Tutorials */