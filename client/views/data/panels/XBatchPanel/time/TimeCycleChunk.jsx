import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
// import { CalcSpin } from '/client/components/tinyUi/Spin';

import { avgOfArray } from '/client/utility/Convert.js';

const TimeCycleChunk = ({
  batchData, seriesData
})=> {
  
  useEffect( ()=>{
    
    if(seriesData) {
      
      let historyFlat = [];
      for( let i of seriesData.items ) { 
        for( let h of i.history ) {
          if(h.good === true && 
             h.type !== 'first' && 
             h.type !== 'scrap' && 
             h.type !== 'undo'
          ) {
            historyFlat.push( h );
          }
        }
      }
      const historyFlatS = historyFlat.sort( (a, b)=> a.time > b.time ? 1 : a.time < b.time ? -1 : 0 );
      
      // const people = _.uniq( Array.from(historyFlatS, t=> t.who) );
      
      // const types = _.uniq( Array.from(historyFlat, t=> t.type) );
      
      // console.log({ people , types });
      
      const chunkedTypes = _.groupBy(historyFlatS, (e)=> e.step + ' ' + e.type);

      for( let type in chunkedTypes ) {
        
        let sample = [];
        
        const chunkedWho = _.groupBy(chunkedTypes[type], (e)=> e.who);
        
        for( let who in chunkedWho ) {
        
          const cycles = chunkedWho[who].reduce( (arr, x, index)=>{
            return index === 0 ? arr :
              [...arr, moment.duration(moment(x.time).diff(moment(chunkedWho[who][index-1].time))).asMinutes() ];
          }, []).sort( (a,b)=> a > b ? 1 : a < b ? -1 : 0 );
          
          if( cycles.length > 1 ) {
            const parslice = Math.ceil( cycles.length * 0.05 );
            const par = cycles.slice(parslice)[0];
            
            const rhythm = cycles.filter( c => c < ( 2 * par ) );
            
            const zpace = avgOfArray(rhythm);
            
            sample.push(zpace);
            
            console.log({ type, who, cycles, parslice, par, rhythm, zpace });
          
          }
          
        }
        
        const avgPace = avgOfArray(sample);
        
        console.log({ type, avgPace });
        
      }
      
    }
    
  }, []);
  
  
  return(
    <div>
    

          
          
          
    
    </div>
  );
};

export default TimeCycleChunk;