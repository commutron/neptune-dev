import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import '/client/utility/ShipTime.js';

import WindowFrame from './WindowFrame';
import WindowGlass from './WindowGlass';

import { listShipDays } from '/client/utility/WorkTimeCalc';

const ShipWindows = ({ 
  calcFor, traceDT, dayTime,
  brancheS, app, user, isDebug, focusBy, salesBy, dense, updateTrigger
})=> {
  
  const [ traceRapid, traceRapidSet ] = useState(false);
  const [ rapidChunk, rapidChunkSet ] = useState(false);
  
  const [ shipDayChunks, shipDayChunksSet ] = useState([]);
  
  const [ traceDTSort, traceDTSSet ] = useState([]);
  
  const addUpTime = (wipArr)=> Array.from(wipArr, 
        x => typeof x.quote2tide === 'number' && x.quote2tide )
              .reduce( (arr, x)=> arr + x, 0);
        
  useLayoutEffect( ()=>{
    const rapidShip = traceDT.filter( x => x.oRapid );
    const someR = rapidShip.length > 0;
    traceRapidSet(someR);
    rapidChunkSet(rapidShip);
        
    const getShipDays = listShipDays( app.nonWorkDays, calcFor, true );
    
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
      
      const timeBucket = dayTime * day[1];
      
      const remain = timeBucket + overflow - wipTime;
      overflow = remain;
      const loaded = index === 0 || wipTime === 0 ? '' :
                     Math.abs(remain) <= (timeBucket * 0.10) ? 'balanced' :
                     remain < 0 ? Math.round(Math.abs(wipTime) / timeBucket * 10)+'pts heavy' :
                     Math.round(timeBucket / Math.abs(wipTime) * 10)+'pts light';

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
            loaded=''
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