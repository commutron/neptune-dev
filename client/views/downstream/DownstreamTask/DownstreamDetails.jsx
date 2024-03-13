import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { min2hr, avgOfArray } from '/client/utility/Convert';

import ProJump from '/client/components/smallUi/ProJump';
import TideActivityData, { TideActivitySquare } from '/client/components/tide/TideActivity';
import { PerformanceSquare } from '/client/components/smallUi/StatusBlocks/PerformanceStatus';
import BranchProgress from '../../overview/columns/BranchProgress';
import NonConCounts from '../../overview/columns/NonConCounts';
import AlterFulfill from '/client/components/forms/Batch/AlterFulfill';

const DownstreamDetails = ({
  indexKey, oB, traceDT,
  app,
  isDebug, canDo,
  focusBy, tagBy, prog, stormy, progCols, ncCols, updateTrigger
})=> {
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');
  
  return(
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
                isRO={isRO}
                isDebug={isDebug}
                canDo={canDo}
                focusBy={focusBy}
                tagBy={tagBy}
                prog={prog}
                stormy={stormy}
                progCols={progCols}
                ncCols={ncCols}
                updateTrigger={updateTrigger}
              />
        )}})}
    </Fragment>
  );
};

export default DownstreamDetails;


const DownstreamScrollChunk = ({
  ck, tBatch,
  app, isRO, isDebug, focusBy, tagBy, canDo, prog, stormy,
  progCols, ncCols,
  updateTrigger
})=> {
  
  const isDone = ck.completedAt ? true : false;
  
  const q2t = ck.quote2tide || 0;
  const e2t = ck.est2tide;
  const e2i = ck.est2item || 0;
  const avgRmn = avgOfArray([q2t, e2t, e2i], true);
  const e2tStatus = !e2t ? 'Time Not Tracked' :
          avgRmn > 0 ? 
            `${min2hr(avgRmn)} hr remain` :
            'time estimations exceeded';
  // avgRmn is an expimental corection to extreme estimations observed in production  
  // const onTime = !ck.estSoonest ? null : new Date(ck.shipAim) > new Date(ck.estSoonest);

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
        <div title={`Remaining Quoted: ${min2hr(q2t)} hours\nPast Performance Estimate: ${min2hr(e2t)} hours\nProduction Curve Estimate: ${min2hr(e2i)} hours`}>{e2tStatus}</div>}
      
      <BranchProgress
        batchID={ck.batchID}
        showTotal={true}
        progCols={progCols}
        tBatch={tBatch}
        progType={prog}
        filterBy={false}
        branchArea={false}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
      
      <PerformanceSquare perf={ck.performTgt} mini={true} />
      
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
          noText={true}
          cleanIcon={true}
          isDebug={isDebug} />
      </div>
      
      <ProJump batchNum={ck.batch} allRO={isRO} />
      
    </div>
  );
};