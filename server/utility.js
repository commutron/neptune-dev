
export function sortBranches(branches) {
  const brancheS = branches.sort((b1, b2)=>
            b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  return brancheS;
}

export function flattenHistory(itemArr) {
  let wipItemHistory = [];
  for( let i of itemArr ) { 
    wipItemHistory.push( 
      i.history.filter( y => y.type !== 'first' && y.good === true)
    );
  }
  const historyFlat = [].concat(...wipItemHistory);

  return historyFlat;
}

export function countWaterfall(stepCounts) {
  return !Array.isArray(stepCounts) || stepCounts.length === 0 ? 0 :
            Array.from(stepCounts, x => x.tick).reduce((x,y)=> x + y);
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
  const count = inst.length > 0 ? inst.reduce((x,y)=> x + y) : 0;
  return count;
}