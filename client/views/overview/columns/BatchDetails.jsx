import React, { useMemo, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import BatchDetailChunk, { ServeDetailChunk } from './BatchDetailChunk';

import Grabber from '/client/utility/Grabber.js';
      
const BatchDetails = ({
  oB, hB, sV, traceDT,
  user, app, brancheS,
  isDebug, holdShow, holdshowSet,
  prog, dense, filterBy, focusBy, tagBy, stormy, branchArea, updateTrigger
})=> {
  
  useEffect(() => {
    Grabber('.overGridScroll');
  }, []);
  
  const statusCols = branchArea ? ['due', 'remaining workdays', 'items quantity'] :
                      ['due', 'remaining workdays', 'items quantity', 'flow set'];
  
  const allBrnch = useMemo( ()=> Array.from(brancheS, x => x.common), [brancheS]);
  const progCols = branchArea ?
                    [ brancheS.find( x => x.branch === filterBy ).common ] :
                    allBrnch;
                    
  const ncCols = ['NC total', 'NC remain', 'NC rate', 'NC items', Pref.scrap, Pref.rapidEx];

  const fullHead = ['sales order','active',...statusCols,'released',...progCols,'Perfomance',...ncCols,''];
  const brchHead = ['sales order','active',...statusCols,...progCols,'Perfomance',...ncCols,''];
  
  const headersArr = branchArea ? brchHead : fullHead;
  
  const isAuth = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']), [user]);
  const isRO = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), 'readOnly'), [user]);
  
  return(
    <div 
      className={
        `overGridScroll forceScrollStyle 
        ${dense ? 'dense' : ''}`
      } tabIndex='1'
    >
      
      {sV &&
        sV.map( (entry, index)=>{
          return(
            <ServeDetailChunk
              key={`${entry.mId}serve${index}`}
              sv={entry}
              isRO={isRO}
              isDebug={isDebug}
              dense={dense}
            />
      )})}
    
      {!dense ? 
        <div className='overGridRowScrollHeader'></div>
      :
        <div className='overGridRowScroll labels'>
          {headersArr.map( (entry, index)=>{
            return(
              <div key={entry+index} className='cap ovColhead'>{entry}</div>
        )})}
        </div>
      }
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <BatchDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={tBatch}
              app={app}
              isAuth={isAuth}
              isRO={isRO}
              isDebug={isDebug}
              statusCols={statusCols}
              progCols={progCols}
              ncCols={ncCols}
              prog={prog}
              dense={dense}
              filterBy={filterBy}
              focusBy={focusBy}
              tagBy={tagBy}
              stormy={stormy}
              branchArea={branchArea}
              updateTrigger={updateTrigger}
            />
      )})}
      
      {hB.length === 0 ? null : // !dense ? 
        <button className='overGridRowScrollHeader labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        ></button>
      /* :
        <button className='overGridRowScroll labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        >
          {headersArr.map( (entry, index)=>{
            return(
              <div key={entry+index} className='cap ovColhead'>{entry}</div>
        )})}
        </button> */
      }
      
      {holdShow &&
        hB.map( (entry, index)=>{
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <BatchDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={tBatch}
              app={app}
              isAuth={isAuth}
              isRO={isRO}
              isDebug={isDebug}
              statusCols={statusCols}
              progCols={progCols}
              ncCols={ncCols}
              prog={prog}
              dense={dense}
              filterBy={filterBy}
              focusBy={focusBy}
              tagBy={tagBy}
              stormy={stormy}
              branchArea={branchArea}
              updateTrigger={updateTrigger}
            />
      )})}
      
    </div>
  );
};

export default BatchDetails;