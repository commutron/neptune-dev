import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';

import WindowFrame from './WindowFrame';
import WindowGlass from './WindowGlass';

import { listShipDays } from '/client/utility/WorkTimeCalc';
import { min2hr } from '/client/utility/Convert';

const ShipWindows = ({ 
  calcFor, traceDT, dayTime,
  brancheS, app, user, isDebug, focusBy, salesBy, dense, updateTrigger
})=> {
  
  const [ traceRapid, traceRapidSet ] = useState(false);
  const [ rapidChunk, rapidChunkSet ] = useState(false);
  
  const [ shipDayChunks, shipDayChunksSet ] = useState([]);
  
  const [ traceDTSort, traceDTSSet ] = useState([]);
  
  const addUpTime = (wipArr)=> Array.from(wipArr, 
        x => typeof x.quote2tide === 'number' && Math.max(x.quote2tide, 0) )
              .reduce( (arr, x)=> arr + x, 0);
        
  useLayoutEffect( ()=>{
    const rapidShip = traceDT.filter( x => x.oRapid );
    const someR = rapidShip.length > 0;
    traceRapidSet(someR);
    rapidChunkSet(rapidShip);
        
    const getShipDays = listShipDays( app, calcFor, true );
    
    const limitToSales = !salesBy ? traceDT :
                          traceDT.filter( t => t.salesOrder === salesBy );
      
    traceDTS = limitToSales.sort((p1, p2)=> {
      const p1bf = p1.bffrRel;
      const p2bf = p2.bffrRel;
      if (isNaN(p1bf)) { return 1 }
      if (isNaN(p2bf)) { return -1 }
      if (p1.lateLate) { return -1 }
      if (p2.lateLate) { return 1 }
      if (p1bf < p2bf) { return -1 }
      if (p1bf > p2bf) { return 1 }
      return 0;
    });
    traceDTSSet( traceDTS );
    
    let overflow = 0;
    
    let windowChunks = [];
    
    getShipDays.map( (day, index )=> {
      
      let mixedOrders = [];
      let wipTime = 0;
      
      if(index === 0) {
        const lateShip = traceDTS.filter( x => !x.completed && 
                          moment(x.shipAim).isSameOrBefore(day[0], 'day'));
        mixedOrders = lateShip;
        wipTime = addUpTime(lateShip);
      }else{
        const early = traceDTS.filter( x => x.completed &&
                        moment(x.shipAim).isSame(day[0], 'day') );
        const shipIn = traceDTS.filter( x => !x.completed && 
                        moment(x.shipAim).isSame(day[0], 'day') );
        mixedOrders = [...early,...shipIn];
        wipTime = addUpTime(shipIn);
      }
      
      const timeBucket = /* dayTime */ (239 * 60) * Math.max(0, day[1]);
      
      const remain = timeBucket + overflow - wipTime;
      overflow = remain;
      
      const points = Math.ceil( remain / (timeBucket * 0.10) );
      const hrsrem = min2hr(Math.abs(remain));
      
      console.log({daygap: Math.max(0, day[1]), timeBucket, overflow, wipTime, remain, points});
      
      const loaded = index === 0 || wipTime === 0 ? [ '', false, '' ] :
              timeBucket === 0 ?
                remain < 0 ? 
                  ['Workday is over', '', hrsrem + ' estimated hours of work remaining'] :
                  ['Workday is over', '', 'No estimated hours of work remaining'] :
              
                Math.abs(remain) <= (timeBucket * 0.10) ? 
                  ['', 'balanced', `(${hrsrem} estimated hours)`] :
              
                points < 0 ? 
                  [ Math.abs(points)+'pts', 'heavy', `(${hrsrem} estimated hours over)` ] :
                  [ Math.abs(points)+'pts', 'light', `(${hrsrem} estimated hours under)` ];
      
      windowChunks.push({
        windowMoment: day[0],
        loaded: loaded,
        mixedOrders: mixedOrders
      });
    });
    
    shipDayChunksSet( windowChunks );
    
  }, [calcFor, traceDT, salesBy]);
  
  const canDo = Roles.userIsInRole(Meteor.userId(), ['edit', 'sales']);
         
  return(
    <div className={`downstreamContent forceScrollStyle ${dense}`}>
       
      <div className={`downstreamFixed forceScrollStyle ${dense}`}>
        {traceRapid &&
          <WindowFrame 
            key={'f'+'-1'}
            windowMoment={moment()}
            loaded={['', false]}
            mixedOrders={rapidChunk}
            indexKey={-1}
            traceDT={traceDTSort}
            app={app}
            user={user}
            isDebug={isDebug}
            focusBy={focusBy}
            dense={dense}
          />
        }
        {shipDayChunks.map( (ch, ix)=>( 
          <WindowFrame 
            key={'f'+ix}
            windowMoment={ch.windowMoment}
            loaded={ch.loaded}
            mixedOrders={ch.mixedOrders}
            indexKey={ix}
            traceDT={traceDTSort}
            app={app}
            user={user}
            isDebug={isDebug}
            focusBy={focusBy}
            dense={dense}
          />
        ))}
      </div>
      
      <div className={`downstreamScroll forceScrollStyle ${dense}`}>
        {traceRapid &&
          <WindowGlass
            key={'s'+'-1'}
            mixedOrders={rapidChunk}
            indexKey={-1}
            traceDT={traceDTSort}
            brancheS={brancheS}
            app={app}
            user={user}
            isDebug={isDebug}
            canDo={canDo}
            focusBy={focusBy}
            dense={dense}
            updateTrigger={updateTrigger}
          />
        }
        {shipDayChunks.map( (ch, ix)=>( 
          <WindowGlass
            key={'s'+ix}
            mixedOrders={ch.mixedOrders}
            indexKey={ix}
            traceDT={traceDTSort}
            brancheS={brancheS}
            app={app}
            user={user}
            isDebug={isDebug}
            canDo={canDo}
            focusBy={focusBy}
            dense={dense}
            updateTrigger={updateTrigger}
          />
        ))}
      </div>
      
    </div>
  );
};

export default ShipWindows;