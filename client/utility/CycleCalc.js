import moment from 'moment';

export function timeRanges(collected, counterFunc, cycles, bracket) {
  const nowLocal = moment();
  
  function runLoop() {
    let countArray = [];
    for(let w = 0; w < cycles; w++) {
    
      const loopBack = nowLocal.clone().subtract(w, bracket); 
     
      const rangeStart = loopBack.clone().startOf(bracket).toISOString();
      const rangeEnd = loopBack.clone().endOf(bracket).toISOString();
      
      const quantity = counterFunc(collected, rangeStart, rangeEnd);
    
      countArray.unshift({ x:cycles-w, y:quantity });
    }
    return countArray;
  }
    
  return runLoop();
}
  