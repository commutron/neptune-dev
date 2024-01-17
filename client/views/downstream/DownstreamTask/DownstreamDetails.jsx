import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { min2hr } from '/client/utility/Convert';

import ProJump from '/client/components/smallUi/ProJump';
import TideActivityData, { TideActivitySquare } from '/client/components/tide/TideActivity';
import { PerformanceSquare } from '/client/components/smallUi/StatusBlocks/PerformanceStatus';
import BranchProgress from '../../overview/columns/BranchProgress';
import NonConCounts from '../../overview/columns/NonConCounts';
import AlterFulfill from '/client/components/forms/Batch/AlterFulfill';

const DownstreamDetails = ({
  indexKey, oB, traceDT,
  user, app,
  isDebug, canDo,
  focusBy, tagBy, prog, dense, stormy, progCols, ncCols, updateTrigger
})=> (
  <Fragment>
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry.batchID );
        if(tBatch) {
          return(
            <DownstreamScrollChunk
              key={indexKey+'c'+index}
              ck={entry}
              tBatch={tBatch}
              app={app}
              user={user}
              isDebug={isDebug}
              canDo={canDo}
              focusBy={focusBy}
              tagBy={tagBy}
              prog={prog}
              dense={dense}
              stormy={stormy}
              progCols={progCols}
              ncCols={ncCols}
              updateTrigger={updateTrigger}
            />
      )}})}
  </Fragment>
);

export default DownstreamDetails;


const DownstreamScrollChunk = ({
  ck, tBatch,
  app, user, isDebug, focusBy, tagBy, canDo, prog, dense, stormy,
  progCols, ncCols,
  updateTrigger
})=> {
  
  const isDone = ck.completedAt ? true : false;
  
  const e2t = ck.est2tide;
  const itmRmn = ck.quantity - (ck.doneItems || 0);
  const itmCrct = itmRmn * (e2t / (ck.quantity || 1));
  const e2tStatus = !e2t ? 'Time Not Tracked' :
          e2t > 0 ? 
            `${min2hr(itmCrct)} hr remain` :
            'estimated time exceeded';
  
  console.log( e2t + ' vs ' + itmCrct);
  const highG = focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';

  const releasedToFloor = tBatch.onFloor || false;

  let storm = stormy === false ? '' :
        stormy === 0 && tBatch.stormy[0] !== true ||
        stormy === 1 && tBatch.stormy[1] !== true ||
        stormy === 2 && tBatch.stormy[2] !== true ? 'clearall' : '';

  return(
    <div className={`downRowScroll ${highG} ${highT} ${storm}`}>
      
      <div title={Pref.salesOrder}>
        <i><i className='label'
          >{Pref.SO}:<br /></i>{ck.salesOrder}</i>
      </div>
      
      <div>
      {!isDone ?
        <TideActivitySquare 
          batchID={ck.batchID} 
          acData={tBatch}
          isDebug={isDebug} />
      :
        <TideActivityData
          batchID={ck.batchID}
          isDebug={isDebug} />
      }    
      </div>
      
      {isDone ? 
        ck.oRapid ? <div title='status'>{Pref.xBatch} {Pref.rapidExd}</div> :
        <div title='status'>{Pref.xBatch} {Pref.isDone}</div> :
        <div title={`Estimate\n${Math.round(e2t)} minutes`}>{e2tStatus}</div>}
      
      <BranchProgress
        batchID={ck.batchID}
        showTotal={true}
        progCols={progCols}
        app={app}
        tBatch={tBatch}
        progType={prog}
        filterBy={false}
        branchArea={false}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
      
      <PerformanceSquare perf={ck.performTgt} />
      
      <NonConCounts
        batchID={ck.batchID}
        tBatch={tBatch}
        releasedToFloor={releasedToFloor}
        force={true}
        app={app}
        ncCols={ncCols}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
      
      <div className='overButton'>  
        <AlterFulfill
          batchId={ck.batchID}
          createdAt={ck.createdAt}
          batch={ck.batch}
          end={ck.salesEnd}
          app={app}
          lock={isDone && !isDebug ? Pref.isDone : false}
          canDo={canDo}
          noText={dense}
          cleanIcon={true}
          isDebug={isDebug} />
      </div>
      
      <ProJump batchNum={ck.batch} dense={dense} />
      
    </div>
  );
};
      
      
  