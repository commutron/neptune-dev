import React from 'react';
import '/client/utility/ShipTime.js';
import DownstreamDetails from './DownstreamDetails';

const WindowGlass = ({ 
  mixedOrders, indexKey, traceDT,
  brancheS, app, user, isDebug, canDo, focusBy, dense, updateTrigger
})=> {
  
  const statCols = ['sales order','active','quote'];
  const progCols = ['total items',...Array.from(brancheS, x => x.common)];
  const ncCols = ['NC total', 'NC remain', 'NC rate', 'NC items', 'scrap', 'RMA'];
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