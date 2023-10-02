import React, { useEffect } from 'react';
import Pref from '/client/global/pref.js';

import BatchTopStatus from '/client/views/overview/columns/BatchTopStatus';
import KittingChecks from './KittingChecks';
import { TideActivitySquare } from '/client/components/tide/TideActivity';
import PrintJump from '/client/components/smallUi/PrintJump';
import ProJump from '/client/components/smallUi/ProJump';

import Grabber from '/client/utility/Grabber.js';

const UpstreamDetails = ({
  oB, hB, traceDT,
  app, brancheS,
  isAuth, isDebug,
  holdShow, holdshowSet,
  dense, focusBy, tagBy
})=> {
  
  useEffect(() => {
    Grabber('.overGridScroll');
  }, []);
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = ['due','remaining workdays','items quantity','flow set'];
  
  const branchClearCols = Array.from(branchClear, x => x.common );
  const kitCols = [...branchClearCols, Pref.baseSerialPart+'s', 'released'];
  
  // due == 'fulfill', 'ship'
  const kitHead = ['sales order','active',...statusCols,...kitCols,'print','production'];
  
  return(
    <div 
      className={
        `overGridScroll forceScrollStyle 
        ${dense ? 'dense' : ''}`
      } 
      tabIndex='1'
    >

      {!dense ? 
        <div className='overGridRowScrollHeader'></div>
      :
        <div className='overGridRowScroll'>
          {kitHead.map( (entry, index)=>{
            return(
              <div key={entry+index}>
                <i className='cap ovColhead'>{entry}</i>
              </div>
        )})}
        </div>
      }
      
      {!oB ? null :
        oB.map( (entry, index)=>{
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <UpstreamDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={tBatch}
              app={app}
              branchClear={branchClear}
              isAuth={isAuth}
              isDebug={isDebug}
              statusCols={statusCols}
              kitCols={kitCols}
              dense={dense}
              focusBy={focusBy}
              tagBy={tagBy}
            />
      )})}
      
      {hB.length === 0 ? null :
        <button className='overGridRowScrollHeader labels grayFade'
          onClick={()=>holdshowSet(!holdShow)}
        ></button>
      }
      
      {holdShow &&
        hB.map( (entry, index)=>{
          const tBatch = traceDT.find( t => t.batchID === entry._id );
          return(
            <UpstreamDetailChunk
              key={`${entry.batchID}hold${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={tBatch}
              app={app}
              branchClear={branchClear}
              isAuth={isAuth}
              isDebug={isDebug}
              statusCols={statusCols}
              kitCols={kitCols}
              dense={dense}
              focusBy={focusBy}
              tagBy={tagBy}
            />
      )})}
      
    </div>
  );
};

export default UpstreamDetails;


const UpstreamDetailChunk = ({ 
  rowIndex, oB, tBatch,
  app, 
  branchClear,
  isAuth, isDebug,
  statusCols, kitCols, 
  dense, focusBy, tagBy
})=> {
  
  const isDone = oB.completed;
  
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
  const releasedToFloor = oB.releases.findIndex( x => x.type === 'floorRelease') >= 0;
  
  return(
    <div className={`overGridRowScroll ${highG} ${highT}`}>
      <div title={Pref.salesOrder}>
        <i><i className='label' 
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      <TideActivitySquare 
        batchID={oB._id} 
        acData={tBatch}
        app={app}
      />
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        tBatch={tBatch}
        app={app}
        isDebug={isDebug}
        statusCols={statusCols}
        dense={dense} />
      
      <KittingChecks
        batchID={oB._id}
        batchNum={oB.batch}
        tBatch={tBatch}
        isDone={isDone}
        releasedToFloor={releasedToFloor}
        releases={oB.releases}
        app={app}
        branchClear={branchClear}
        kitCols={kitCols}
        dense={dense}
        isAuth={isAuth}
        isDebug={isDebug} />
    
      <PrintJump
        batchNum={oB.batch}
        tBatch={tBatch}
        title='Print Label'
        iText={!dense}
      />
      
      <ProJump batchNum={oB.batch} dense={dense} />
        
    </div>
  );
};