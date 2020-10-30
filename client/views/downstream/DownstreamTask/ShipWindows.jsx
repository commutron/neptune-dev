import React, { useState, useLayoutEffect } from 'react';
// import moment from 'moment';
// import 'moment-timezone';
// import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import WindowFrame from './WindowFrame';
import WindowGlass from './WindowGlass';

import { listShipDays } from '/client/utility/WorkTimeCalc';
// import { min2hr } from '/client/utility/Convert';
// import { LeapTextLink } from '/client/components/tinyUi/LeapText.jsx';

const ShipWindows = ({ 
  calcFor, bCache, pCache, acCache, zCache,
  brancheS, app, user, density
})=> {
  
  const [ nextShipDays, nextShipDaysSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    const numOf = calcFor + 1;
    const getShipDays = listShipDays( app.nonWorkDays, numOf, true );
    // returns an array of moments
    nextShipDaysSet(getShipDays);
  }, [calcFor, pCache, zCache]);

         
  return(
    <div className={`downstreamContent forceScrollStyle ${density}`}>
       
      <div className={`downstreamFixed forceScrollStyle ${density}`}>
        {nextShipDays.map( (e, ix)=>( 
          <WindowFrame 
            key={'f'+ix}
            windowMoment={e}
            indexKey={ix}
            bCache={bCache}
            pCache={pCache}
            acCache={acCache}
            zCache={zCache}
            brancheS={brancheS}
            app={app}
            user={user}
          />
        ))}
      </div>
      
      <div className={`downstreamScroll forceScrollStyle ${density}`}>
        {nextShipDays.map( (e, ix)=>( 
          <WindowGlass
            key={'s'+ix}
            windowMoment={e}
            indexKey={ix}
            bCache={bCache}
            pCache={pCache}
            acCache={acCache}
            zCache={zCache}
            brancheS={brancheS}
            app={app}
            user={user}
          />
        ))}
      </div>
      
    </div>
  );
};

export default ShipWindows;