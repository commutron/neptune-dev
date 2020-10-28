import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import DownstreamHeaders from './DownstreamHeaders';

import { min2hr } from '/client/utility/Convert';

const WindowFrame = ({ 
  windowMoment, indexKey, 
  bCache, pCache, acCache, zCache, 
  brancheS, app, user
})=> {
  
  const [ wipOrders, wipOrdersSet ] = useState([]);
  const [ mixedOrders, mixedOrdersSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    if(indexKey === 0) {
      const lateShip = pCache.filter( x => moment(x.shipAim).isSameOrBefore(windowMoment, 'day') );
    //const lateTimeArr = Array.from(lateBatch, x => typeof x.quote2tide === 'number' && x.quote2tide );
    //const lateTimeTotal = lateTimeArr.reduce( (arr, x)=> x > 0 ? arr + x : arr, 0 );
      wipOrdersSet( lateShip );
      mixedOrdersSet( lateShip );
    }else{
      const shipIn = pCache.filter( x => moment(x.shipAim).isSame(windowMoment, 'day') );
      const early = zCache.filter( x => {
        if(moment(x.shipAim).isSame(windowMoment, 'day')) { return true }
      });
      wipOrdersSet( shipIn );
      mixedOrdersSet( [...shipIn,...early] );
    }
  }, []);
  
  

  return(
    <div key={'f'+indexKey} className='downGridFrameFixed'>
      <div className='downWeek' title={`ship day ${indexKey+1}`}
        >{windowMoment.format('dddd MMM DD')}
      </div>
      
      <WindowHeader 
        windowMoment={windowMoment}
        shipIn={wipOrders}
        pCache={pCache}
      />
        
      <div className='downOrdersFixed'>
        <DownstreamHeaders
          indexKey={'fancylist0F'+indexKey}
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
    <div className='downHeadFixed'>
      {reTimeTotal > 0 && <i>{min2hr(reTimeTotal)} hours total remain</i>}
    </div>
  );
};