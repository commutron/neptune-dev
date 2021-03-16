

export function sortBranches(branches) {
  const brancheS = branches.sort((b1, b2)=>
            b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  return brancheS;
}

export function flattenHistory(itemArr) {
  // const wipItemHistory = Array.from( itemArr, 
  //                             x => x.history.filter( 
  //  /* Slower */                y => y.type !== 'first' && y.good === true) );
                                
  let wipItemHistory = [];
  for( let i of itemArr ) { 
    wipItemHistory.push( 
      i.history.filter( y => y.type !== 'first' && y.good === true)
    );
  }
  const historyFlat = [].concat(...wipItemHistory);

  // let historyFlat = [];
  // for(const h of wipItemHistory) {
  //   Array.prototype.push.apply(historyFlat, h);
  // }  /* Slower */   
  
  return historyFlat;
}

export function countWaterfall(stepCounts) {
  return !Array.isArray(stepCounts) || stepCounts.length === 0 ? 0 :
            Array.from(stepCounts, x => x.tick).reduce((x,y)=> x + y);
}