import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
// import Pref from '/client/global/pref.js';

import DownstreamDetails from './DownstreamDetails';

// import { min2hr } from '/client/utility/Convert';

const WindowGlass = ({ 
  windowMoment, indexKey, traceDT,
  brancheS, app, user, isDebug, canDo, focusBy, dense, updateTrigger
})=> {
  
  const [ mixedOrders, mixedOrdersSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    if(indexKey === -1) {
      const rapidShip = traceDT.filter( x => x.oRapid );
      mixedOrdersSet( rapidShip );
    }else if(indexKey === 0) {
      const lateShip = traceDT.filter( x => !x.completed && 
                        moment(x.shipAim).isSameOrBefore(windowMoment, 'day') );
      mixedOrdersSet( lateShip );
    }else{
      const early = traceDT.filter( x => x.completed &&
                      moment(x.shipAim).isSame(windowMoment, 'day') );
      const shipIn = traceDT.filter( x => !x.completed && 
                      moment(x.shipAim).isSame(windowMoment, 'day') );
      mixedOrdersSet( [...early,...shipIn] );
    }
  }, [traceDT]);
  
  const statCols = ['sales order','active','quote'];
  const progCols = ['total items',...Array.from(brancheS, x => x.common)];
  const ncCols = ['NC total', 'NC remain', 'NC per item', 'NC items', 'scrap', 'RMA'];
  const headersArr = [...statCols,...progCols,'Perfomance',...ncCols,'',''];

  return(
    <div className={`downGridFrameScroll 
                    ${indexKey === -1 ? 'rapidtitle' : 
                      indexKey === 0 ? 'latetitle' : ''}`}
    tabIndex='1'>
     
      <div className='downHeadScroll'>
        {headersArr.map( (entry, index)=>{
          return(
            <div 
              key={entry+index} 
              className={`cap blackT ${!dense ? 'invisible' : ''}`}
              >{entry}
            </div>
      )})}
      </div>
        
      <div className='downOrdersScroll'>
        <DownstreamDetails
          indexKey={indexKey}
          oB={mixedOrders}
          traceDT={traceDT}
          title='things'
          showMore={true}
          user={user}
          app={app}
          isDebug={isDebug}
          canDo={canDo}
          isNightly={false}
          dense={dense}
          focusBy={focusBy}
          progCols={progCols}
          ncCols={ncCols}
          updateTrigger={updateTrigger}
        />
      </div>
    </div>
  );
};

export default WindowGlass;