import React from 'react';
import Pref from '/client/global/pref.js';
import DownstreamDetails from './DownstreamDetails';

const WindowGlass = ({ 
  mixedOrders, indexKey, traceDT,
  brancheS, app, user, isDebug, canDo, 
  focusBy, tagBy, prog, dense, stormy,
  updateTrigger
})=> {
  
  const statCols = ['sales order','active','estimate'];
  const progCols = ['total items',...Array.from(brancheS, x => x.common)];
  const ncCols = ['NC total', 'NC remain', 'NC rate', 'NC items', Pref.scrap, Pref.rapidEx];
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
          prog={prog}
          dense={dense}
          focusBy={focusBy}
          tagBy={tagBy}
          stormy={stormy}
          progCols={progCols}
          ncCols={ncCols}
          updateTrigger={updateTrigger}
        />
      </div>
    </div>
  );
};

export default WindowGlass;