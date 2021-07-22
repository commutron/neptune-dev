import moment from 'moment';

export function syncHoliday(accessKey) {
  const app = AppDB.findOne({orgKey:accessKey}, {fields:{'nonWorkDays':1}});
  if(Array.isArray(app.nonWorkDays) ) { 
    moment.updateLocale('en', { holidays: app.nonWorkDays });
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
  const inst = Array.from(ncArr, x => Number(x.multi) || 1);
  const count = inst.reduce((x,y)=> x + y, 0);
  return count;
}
export function countMultiRefs(shArr) {
  const inst = Array.from(shArr, x => (Number(x.multi) || 1) * x.refs.length);
  const count = inst.reduce((x,y)=> x + y, 0);
  return count;
}

export function noIg() {
  const xg = GroupDB.findOne({internal: true},{fields:{'_id':1}});
  return xg ? xg._id : 'n0ne';
}

export function getEst(widgetId, quantity) {
  const wdjt = WidgetDB.findOne({ _id: widgetId });
  const perQ = !wdjt.quoteStats ? 0 : wdjt.quoteStats.stats.tidePerItemAvg;
  const mEst = perQ * quantity;
  return mEst;
}