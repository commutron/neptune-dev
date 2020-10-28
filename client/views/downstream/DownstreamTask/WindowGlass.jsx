import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import DownstreamDetails from './DownstreamDetails';

import { min2hr } from '/client/utility/Convert';

const WindowGlass = ({ 
  windowMoment, indexKey, 
  bCache, pCache, acCache, zCache, 
  brancheS, app, user
})=> {
  
  const [ mixedOrders, mixedOrdersSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    if(indexKey === 0) {
      const lateShip = pCache.filter( x => moment(x.shipAim).isSameOrBefore(windowMoment, 'day') );
    //const lateTimeArr = Array.from(lateBatch, x => typeof x.quote2tide === 'number' && x.quote2tide );
    //const lateTimeTotal = lateTimeArr.reduce( (arr, x)=> x > 0 ? arr + x : arr, 0 );
      mixedOrdersSet( lateShip );
    }else{
      const shipIn = pCache.filter( x => moment(x.shipAim).isSame(windowMoment, 'day') );
      const early = zCache.filter( x => {
        if(moment(x.shipAim).isSame(windowMoment, 'day')) { return true }
      });
      mixedOrdersSet( [...shipIn,...early] );
    }
  }, []);

  return(
    <div key={'s'+indexKey} className='downGridFrameScroll'>
    
      <div className='downHeadScroll'></div>
        
      <div className='downOrdersScroll'>
        <DownstreamDetails
          indexKey={'fancylist0S'+indexKey}
          oB={mixedOrders}
          bCache={bCache}
          title='things'
          showMore={true}
          pCache={pCache}
          acCache={acCache}
          user={user}
          app={app}
          brancheS={brancheS}
          isDebug={false}
          isNightly={false}
          dense={false}
          filterBy={false}
        />
      </div>
    </div>
  );
};

export default WindowGlass;