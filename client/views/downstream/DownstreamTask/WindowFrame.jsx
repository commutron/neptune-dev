import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
// import Pref from '/client/global/pref.js';

import DownstreamHeaders from './DownstreamHeaders';

import { min2hr } from '/client/utility/Convert';

const WindowFrame = ({ 
  windowMoment, indexKey, traceDT,
  pCache, 
  app, user, isDebug, focusBy, dense
})=> {
  
  const [ wipOrders, wipOrdersSet ] = useState([]);
  const [ mixedOrders, mixedOrdersSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    if(indexKey === 0) {
      const lateShip = pCache.filter( x => moment(x.shipAim).isSameOrBefore(windowMoment, 'day') );
      wipOrdersSet( lateShip );
      mixedOrdersSet( lateShip );
    }else{
      // const early = zCache.filter( x => {
      //   if(moment(x.shipAim).isSame(windowMoment, 'day')) { return true } });
      const early = traceDT.filter( x => {
        return x.completed && moment(x.shipAim).isSame(windowMoment, 'day') });
      
      const shipIn = pCache.filter( x => moment(x.shipAim).isSame(windowMoment, 'day') );
      wipOrdersSet( shipIn );
      mixedOrdersSet( [...early,...shipIn] );
    }
  }, [pCache, traceDT]);
  
  
  return(
    <div className='downGridFrameFixed'>
      <div className='downWeek' title={`ship day ${indexKey+1}`}
        >{indexKey === 0 ? 'Late' : windowMoment.format('dddd MMM DD')}
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
          traceDT={traceDT}
          title='things'
          showMore={true}
          pCache={pCache}
          user={user}
          app={app}
          isDebug={isDebug}
          isNightly={false}
          focusBy={focusBy}
          dense={dense}
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
    <div className='downHeadFixed grayT'>
      {reTimeTotal > 0 && <i>{min2hr(reTimeTotal)} total quote hours remain</i>}
    </div>
  );
};