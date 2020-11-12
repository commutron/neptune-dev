import React, { useState, useLayoutEffect } from 'react';
// import moment from 'moment';
// import 'moment-timezone';
// import 'moment-business-time';
import '/client/utility/ShipTime.js';
// import Pref from '/client/global/pref.js';

import WindowFrame from './WindowFrame';
import WindowGlass from './WindowGlass';

import { listShipDays } from '/client/utility/WorkTimeCalc';
// import { min2hr } from '/client/utility/Convert';
// import { LeapTextLink } from '/client/components/tinyUi/LeapText.jsx';

const ShipWindows = ({ 
  calcFor, traceDT, bCache, pCache, acCache, zCache,
  brancheS, app, user, isDebug, focusBy, dense, updateTrigger
})=> {
  
  const [ nextShipDays, nextShipDaysSet ] = useState([]);
  const [ pCacheSort, pCacheSSet ] = useState([]);
  const [ zCacheSort, zCacheSSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    const numOf = calcFor + 1;
    const getShipDays = listShipDays( app.nonWorkDays, numOf, true );
    // returns an array of moments
    nextShipDaysSet(getShipDays);
    
    pCacheSSet( pCache.sort((p1, p2)=> {
      const p1bf = p1.estEnd2fillBuffer;
      const p2bf = p2.estEnd2fillBuffer;
      if (!p1bf) { return 1 }
      if (!p2bf) { return -1 }
      if (p1.lateLate) { return -1 }
      if (p2.lateLate) { return 1 }
      if (p1bf < p2bf) { return -1 }
      if (p1bf > p2bf) { return 1 }
      return 0;
    }) );
    
    zCacheSSet( zCache.sort((z1, z2)=> {
      if (z1.gapZone[0] < z2.gapZone[0]) { return -1 }
      if (z1.gapZone[0] > z2.gapZone[0]) { return 1 }
      return 0;
    }) );
  }, [calcFor, pCache, zCache]);

         
  return(
    <div className={`downstreamContent forceScrollStyle ${dense}`}>
       
      <div className={`downstreamFixed forceScrollStyle ${dense}`}>
        {nextShipDays.map( (e, ix)=>( 
          <WindowFrame 
            key={'f'+ix}
            windowMoment={e}
            indexKey={ix}
            traceDT={traceDT}
            bCache={bCache}
            pCache={pCacheSort}
            acCache={acCache}
            zCache={zCacheSort}
            brancheS={brancheS}
            app={app}
            user={user}
            isDebug={isDebug}
            focusBy={focusBy}
            dense={dense}
          />
        ))}
      </div>
      
      <div className={`downstreamScroll forceScrollStyle ${dense}`}>
        {nextShipDays.map( (e, ix)=>( 
          <WindowGlass
            key={'s'+ix}
            windowMoment={e}
            indexKey={ix}
            traceDT={traceDT}
            bCache={bCache}
            pCache={pCacheSort}
            acCache={acCache}
            zCache={zCacheSort}
            brancheS={brancheS}
            app={app}
            user={user}
            isDebug={isDebug}
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