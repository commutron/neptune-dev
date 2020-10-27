import React, { Fragment } from 'react';
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
  
  const ix = indexKey;

  const shipIn = pCache.filter( x => moment(x.shipAim).isSame(windowMoment, 'day') );
    
  const early = zCache.filter( x => {
    if(moment(x.shipAim).isSame(windowMoment, 'day')) { return true }
  });
  
  const mixedOrders = [...shipIn,...early];

  return(
    <div key={ix} className='downGridFrameScroll'>
    
      <div className='downHeadScroll'></div>
        
      <div className='downOrdersScroll'>
        <DownstreamDetails
            key={'fancylist0'+ix}
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