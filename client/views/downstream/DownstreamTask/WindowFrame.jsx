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
  app, user, isDebug, focusBy, dense
})=> {
  
  const [ wipOrders, wipOrdersSet ] = useState([]);
  const [ mixedOrders, mixedOrdersSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    if(indexKey === -1) {
      const rapidShip = traceDT.filter( x => x.oRapid );
      wipOrdersSet( rapidShip );
      mixedOrdersSet( rapidShip );
    }else if(indexKey === 0) {
      const lateShip = traceDT.filter( x => !x.completed && 
                        moment(x.shipAim).isSameOrBefore(windowMoment, 'day'));
      wipOrdersSet( lateShip );
      mixedOrdersSet( lateShip );
    }else{
      const early = traceDT.filter( x => x.completed &&
                      moment(x.shipAim).isSame(windowMoment, 'day') );
      const shipIn = traceDT.filter( x => !x.completed && 
                      moment(x.shipAim).isSame(windowMoment, 'day') );
      wipOrdersSet( shipIn );
      mixedOrdersSet( [...early,...shipIn] );
    }
  }, [traceDT]);
  
  
  return(
    <div className={`downGridFrameFixed 
                    ${indexKey === -1 ? 'rapidtitle' : 
                      indexKey === 0 ? 'latetitle' : ''}`}
    >
      <div className='downWeek' title={`ship day ${indexKey+1}`}
        >{indexKey === -1 ? 'Rapid' : indexKey === 0 ? 'Late' : 
          windowMoment.format('dddd MMM DD')
        }
      </div>
      
      <WindowHeader 
        windowMoment={windowMoment}
        shipIn={wipOrders}
      />
        
      <div className='downOrdersFixed'>
        <DownstreamHeaders
          indexKey={'fancylist0F'+indexKey}
          oB={mixedOrders}
          traceDT={traceDT}
          title='things'
          showMore={true}
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


const WindowHeader = ({ windowMoment, shipIn })=> {
  
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