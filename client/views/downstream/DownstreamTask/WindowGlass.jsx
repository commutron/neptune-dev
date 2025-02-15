import React from 'react';
import Pref from '/client/global/pref.js';
import DownstreamDetails from './DownstreamDetails';

const WindowGlass = ({ 
  mixedOrders, indexKey, traceDT,
  brancheS, app, user, isDebug, 
  holdShow, holdshowSet, canDo, 
  focusBy, tagBy, prog, stormy,
  updateTrigger
})=> {
  
  const statCols = ['sales order','active','estimate'];
  const progCols = ['total items',...Array.from(brancheS, x => x.common)];
  const ncCols = ['NC total', 'NC remain', 'NC rate', 'NC items', Pref.scrap, Pref.rapidEx];
  const headersArr = [...statCols,...progCols,'Perfomance',...ncCols,'Date','Docs',''];

  const dayOrders = indexKey === 0 ? mixedOrders.filter( o => !o.hold ) : mixedOrders;
  const hldOrders = indexKey === 0 ? mixedOrders.filter( o => o.hold ) : [];
  
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
              className='cap blackT'
              >{entry}
            </div>
      )})}
      </div>
        
      <div className='downOrdersScroll'>
        <DownstreamDetails
          indexKey={indexKey}
          oB={dayOrders}
          traceDT={traceDT}
          title='things'
          app={app}
          isDebug={isDebug}
          canDo={canDo}
          isNightly={false}
          prog={prog}
          focusBy={focusBy}
          tagBy={tagBy}
          stormy={stormy}
          progCols={progCols}
          ncCols={ncCols}
          updateTrigger={updateTrigger}
        />
      
        {hldOrders.length === 0 ? null :
          <button className='downRowScroll labels grayFade'
            onClick={()=>holdshowSet(!holdShow)}
          ></button>
        }
    
        {holdShow &&
          <DownstreamDetails
            indexKey={indexKey+'hld'}
            oB={hldOrders}
            traceDT={traceDT}
            title='things'
            showMore={true}
            user={user}
            app={app}
            isDebug={isDebug}
            canDo={canDo}
            isNightly={false}
            prog={prog}
            focusBy={focusBy}
            tagBy={tagBy}
            stormy={stormy}
            progCols={progCols}
            ncCols={ncCols}
            updateTrigger={updateTrigger}
          />
        }
      </div>
    </div>
  );
};

export default WindowGlass;