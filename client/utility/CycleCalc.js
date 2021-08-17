import moment from 'moment';
import { avgOfArray, round1Decimal, round2Decimal, minsec } from '/client/utility/Convert.js';

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

export function cyclyPaceCalc( chunkedTypes, widerange, debug) {
  const stdDv = 3; // Standard Deviation
  const orMag = 10; // Order of Magnitude
  const paRng = widerange ? orMag : stdDv;

  let clickCycles = [];
  
  for( let type in chunkedTypes ) {
        
    let sample = [];
    let ideals = [];
    
    const chunkedWho = _.groupBy(chunkedTypes[type], (e)=> e.who);
    
    for( let who in chunkedWho ) {
    
      const cycles = chunkedWho[who].reduce( (arr, x, index)=>{
        return index === 0 ? arr :
          [...arr, moment.duration(moment(x.time).diff(moment(chunkedWho[who][index-1].time))).asMinutes() ];
      }, []).sort( (a,b)=> a > b ? 1 : a < b ? -1 : 0 );
      
      if( cycles.length > 1 ) {
        const parslice = Math.ceil( cycles.length * 0.10 );
        const par = cycles.slice(parslice)[0];
        const out = par * paRng;
        
        const rhythm = cycles.filter( c => c < out );
        
        const pace = avgOfArray(rhythm);
        
        sample.push(pace);
        
        const best = cycles.slice(0, parslice);
        ideals = [...ideals, ...best];
        
        debug && console.log({ type, who, par, out, pace, ideals });
      }
    }
    
    const avgPace = minsec( avgOfArray(sample) );
    const avgBest = minsec( avgOfArray(ideals) );
    
    clickCycles.push({ type, avgBest, avgPace });
  }
  return clickCycles;
} 