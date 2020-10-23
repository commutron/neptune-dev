import React, { Fragment } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import DownstreamDetails from './DownstreamDetails';

import { min2hr } from '/client/utility/Convert';

const WindowFrame = ({ 
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
    <div key={ix} className='downGridFrame'>
      <div className='downWeek'>
        <dt title={`ship day ${ix+1}`}>{windowMoment.format('dddd MMM DD')}</dt>
      </div>
      <div className='downOrders'>
      
        <WindowHeader 
          windowMoment={windowMoment}
          shipIn={shipIn}
          pCache={pCache}
        />
        
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

export default WindowFrame;


const WindowHeader = ({ windowMoment, shipIn, pCache })=> {
  
  const reTimeArr = Array.from(shipIn, 
    x => typeof x.quote2tide === 'number' && x.quote2tide );
  const reTimeTotal = reTimeArr.reduce( 
    (arr, x)=> x > 0 ? arr + x : arr, 0 );
    
  return(
    <div>
      {reTimeTotal > 0 && <i> -> {min2hr(reTimeTotal)} hours total remain</i>}
    </div>
  );
};