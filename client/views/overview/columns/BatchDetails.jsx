import React, { useMemo, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import BatchDetailChunk, { ServeDetailChunk } from './BatchDetailChunk';

import Grabber from '/client/utility/Grabber.js';
      
const BatchDetails = ({
  oB, hB, sV,
  user, app, brancheS,
  isDebug, holdShow, holdshowSet,
  prog, filterBy, focusBy, tagBy, stormy, branchArea, updateTrigger
})=> {
  
  useEffect(() => {
    Grabber('.overGridScroll');
  }, []);
  
  const statusCols = ['due', 'remaining workdays', 'items quantity','flow set','docs'];
  
  const allBrnch = useMemo( ()=> Array.from(brancheS, x => x.common), [brancheS]);
  const progCols = branchArea ?
                    [ brancheS.find( x => x.branch === filterBy ).common ] :
                    allBrnch;
                    
  const ncCols = ['NC total', 'NC remain', 'NC rate', 'NC items', Pref.scrap, Pref.rapidEx];

  const fullHead = ['sales order','active',...statusCols,'released',...progCols,'Perfomance',...ncCols,'Production'];
  const brchHead = ['sales order','active',...statusCols,...progCols,'Perfomance',...ncCols,'Production'];
  
  const headersArr = branchArea ? brchHead : fullHead;
  
  const isAuth = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']), [user]);
  const isRO = useMemo( ()=> Roles.userIsInRole(Meteor.userId(), 'readOnly'), [user]);
  
  return(
    <div className='overGridScroll forceScrollStyle' tabIndex='1'>
      
      {sV &&
        sV.map( (entry, index)=>{
          return(
            <ServeDetailChunk
              key={`${entry.mId}serve${index}`}
              sv={entry}
              isRO={isRO}
              isDebug={isDebug}
            />
      )})}
    
      
      <div className='overGridRowScroll labels'>
        {headersArr.map( (entry, index)=>{
          return(
            <div key={entry+index} className='cap ovColhead'>{entry}</div>
      )})}
      </div>
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={entry.trace}
              app={app}
              isAuth={isAuth}
              isRO={isRO}
              isDebug={isDebug}
              statusCols={statusCols}
              progCols={progCols}
              ncCols={ncCols}
              prog={prog}
              filterBy={filterBy}
              focusBy={focusBy}
              tagBy={tagBy}
              stormy={stormy}
              branchArea={branchArea}
              updateTrigger={updateTrigger}
            />
        )})}
      
      {hB.length === 0 ? null : !holdShow ?
        <button className='overGridRowScrollHeader labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        ></button>
        :
        <button className='overGridRowScroll labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        >
          {headersArr.map( (entry, index)=>{
            return(
              <div key={entry+index} className='cap ovColhead'>{entry}</div>
        )})}
        </button> 
      }
      
      {holdShow &&
        hB.map( (entry, index)=>{
          // const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <BatchDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={entry.trace}
              app={app}
              isAuth={isAuth}
              isRO={isRO}
              isDebug={isDebug}
              statusCols={statusCols}
              progCols={progCols}
              ncCols={ncCols}
              prog={prog}
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