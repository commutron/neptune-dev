export function countWaterfall(stepCounts) {
  return !Array.isArray(stepCounts) || stepCounts.length === 0 ? 0 :
            Array.from(stepCounts, x => x.tick).reduce((x,y)=> x + y);
}

export const branchesSort = (branches)=> {
  return branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : 
          b1.position > b2.position ? -1 : 0 );
};
export const branchesOpenSort = (branches)=> {
  const open = branches.filter( b => b.open === true );
  return open.sort((b1, b2)=>
          b1.position < b2.position ? 1 : 
          b1.position > b2.position ? -1 : 0 );
};

export function countMulti(ncArr) {
  const inst = Array.from(ncArr, x => Number(x.multi) || 1);
  const count = inst.length > 0 ? inst.reduce((x,y)=> x + y) : 0;
  return count;
}

/*
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
*/
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

/*
arraySelfCount(inputArray) {
  const typeObj = _.countBy(inputArray, x => x.type);
  const typeObjClean = _.omit(typeObj, (value, key, object)=> { return key == false; });
  const itr = Object.entries(typeObj);
  const typeArr = Array.from(itr, (arr)=> { return {type: arr[0], count: arr[1]} } );
  return typeArr;
},
*/