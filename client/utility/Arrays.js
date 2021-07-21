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