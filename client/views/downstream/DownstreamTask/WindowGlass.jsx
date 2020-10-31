import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import DownstreamDetails from './DownstreamDetails';

// import { min2hr } from '/client/utility/Convert';

const WindowGlass = ({ 
  windowMoment, indexKey, 
  bCache, pCache, acCache, zCache, 
  brancheS, app, user, dense
})=> {
  
  const [ mixedOrders, mixedOrdersSet ] = useState([]);
  
  useLayoutEffect( ()=>{
    if(indexKey === 0) {
      const lateShip = pCache.filter( x => moment(x.shipAim).isSameOrBefore(windowMoment, 'day') );
      mixedOrdersSet( lateShip );
    }else{
      const shipIn = pCache.filter( x => moment(x.shipAim).isSame(windowMoment, 'day') );
      const early = zCache.filter( x => {
        if(moment(x.shipAim).isSame(windowMoment, 'day')) { return true }
      });
      mixedOrdersSet( [...shipIn,...early] );
    }
  }, [acCache]);
  
  const statCols = ['sales order','active','quote'];
  const progCols = ['total items',...Array.from(brancheS, x => x.common)];
  const ncCols = ['NC total', 'NC remain', 'NC per item', 'NC items', 'scrap', 'RMA'];
  const headersArr = [...statCols,...progCols,...ncCols,''];

  return(
    <div className='downGridFrameScroll' tabIndex='1'>
     
      <div className='downHeadScroll'>
        {headersArr.map( (entry, index)=>{
          return(
            <div 
              key={entry+index} 
              className={`cap grayT ${!dense ? 'invisible' : ''}`}
              >{entry}
            </div>
      )})}
      </div>
        
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
          dense={dense}
          filterBy={false}
          progCols={progCols}
          ncCols={ncCols}
        />
      </div>
    </div>
  );
};

export default WindowGlass;