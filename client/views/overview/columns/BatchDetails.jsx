import React from 'react';
import Pref from '/client/global/pref.js';

import BatchTopStatus from './BatchTopStatus';
import ReleasedCheck from './ReleasedCheck';
import TideActivityData, { TideActivitySquare } from '/client/components/tide/TideActivity';
import { PerformanceSquare } from '/client/components/smallUi/StatusBlocks/PerformanceStatus';
import BranchProgress from './BranchProgress';
import NonConCounts from './NonConCounts';
import ProJump from '/client/components/smallUi/ProJump';

const BatchDetails = ({
  oB, traceDT,
  user, app, brancheS,
  isDebug,
  dense, filterBy, focusBy, tagBy, stormy, branchArea, updateTrigger
})=> {
  
  const branchClear = brancheS.filter( b => b.reqClearance === true );
  
  const statusCols = branchArea ? ['due', 'remaining workdays', 'items quantity'] :
                      ['due', 'remaining workdays', 'items quantity', 'flow set'];
  
  const progCols = branchArea ?
                    [ brancheS.find( x => x.branch === filterBy).common ] :
                    Array.from(brancheS, x => x.common);
  const ncCols = ['NC total', 'NC remain', 'NC rate', 'NC items', Pref.scrap, Pref.rapidEx];

  const fullHead = ['sales order','active',...statusCols,'released',...progCols,'Perfomance',...ncCols,''];
  const brchHead = ['sales order','active',...statusCols,...progCols,'Perfomance',...ncCols,''];
  
  const headersArr = branchArea ? brchHead : fullHead;
  
  const isAuth = Roles.userIsInRole(Meteor.userId(), ['run', 'kitting']);
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
    <div className={`overGridScroll forceScrollStyle ${dense ? 'dense' : ''}`} tabIndex='1'>
      
      {!dense ? 
        <div className='overGridRowScrollHeader'></div>
      :
        <div className='overGridRowScroll'>
          {headersArr.map( (entry, index)=>{
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
            <BatchDetailChunk
              key={`${entry.batchID}live${index}`}
              rowIndex={index}
              oB={entry}
              tBatch={tBatch}
              user={user}
              app={app}
              brancheS={brancheS}
              branchClear={branchClear}
              isAuth={isAuth}
              isRO={isRO}
              isDebug={isDebug}
              statusCols={statusCols}
              progCols={progCols}
              ncCols={ncCols}
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


const BatchDetailChunk = ({ 
  rowIndex, oB, tBatch,
  user, app, 
  brancheS, branchClear,
  isAuth, isRO, isDebug,
  statusCols, progCols, ncCols, 
  dense, filterBy, focusBy, tagBy, stormy, branchArea,
  updateTrigger
})=> {
  
  const isX = oB.completed === undefined ? false : true;
  const isDone = isX ? oB.completed : oB.finishedAt !== false;
  
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
  const releasedToFloor = oB.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0;
  const rTFghostC = releasedToFloor ? '' : 'ghostState';
  const rTFghostT = releasedToFloor ? '' : `Not released from ${Pref.kitting}`;
  
  let storm = stormy === false ? '' :
        stormy === 0 && tBatch.stormy[0] !== true ||
        stormy === 1 && tBatch.stormy[1] !== true ||
        stormy === 2 && tBatch.stormy[2] !== true ? 'clearall' : '';
      
  return(
    <div className={`overGridRowScroll ${highG} ${highT} ${storm} ${rTFghostC}`} title={rTFghostT}>
      <div>
        <i><i className='label' title={Pref.salesOrder}
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      <div>
      {!isDone ?
        <TideActivitySquare 
          batchID={oB._id} 
          acData={tBatch}
          isDebug={isDebug} />
      :
        <TideActivityData
          batchID={oB._id}
          isDebug={isDebug} />
      }    
      </div>
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        tBatch={tBatch}
        app={app}
        isDebug={isDebug}
        statusCols={statusCols}
        branchArea={branchArea}
        dense={dense} />
    
      {!branchArea ?
        <ReleasedCheck
          batchID={oB._id}
          batchNum={oB.batch}
          isDone={isDone}
          releasedToFloor={releasedToFloor}
          releases={oB.releases}
          app={app}
          dense={dense}
          isAuth={isAuth}
          isRO={isRO}
          isDebug={isDebug} />
      : null}
      
      <BranchProgress
        batchID={oB._id}
        progCols={progCols}
        app={app}
        filterBy={filterBy}
        branchArea={branchArea}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
      
      <PerformanceSquare perf={tBatch.performTgt} />
      
      <NonConCounts
        batchID={oB._id}
        releasedToFloor={releasedToFloor}
        app={app}
        ncCols={ncCols}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
      
      <ProJump batchNum={oB.batch} dense={dense} />
        
    </div>
  );
};