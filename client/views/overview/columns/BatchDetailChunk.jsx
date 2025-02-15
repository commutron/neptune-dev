import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import BatchTopStatus from './BatchTopStatus';
import ReleasedCheck from './ReleasedCheck';
import TideActivityData, { TideActivitySquare } from '/client/components/tide/TideActivity';
import { PerformanceSquare } from '/client/components/smallUi/StatusBlocks/PerformKPI';
import BranchProgress from './BranchProgress';
import NonConCounts from './NonConCounts';
import ProJump, { SrvJump } from '/client/components/smallUi/ProJump';
import { round1Decimal } from '/client/utility/Convert';

const BatchDetailChunk = ({ 
  rowIndex, oB, tBatch,
  app,
  isAuth, isRO, isDebug,
  statusCols, progCols, ncCols, 
  prog, filterBy, focusBy, tagBy, stormy, branchArea,
  updateTrigger
})=> {
  
  const isX = oB.completed === undefined ? false : true;
  const isDone = isX ? oB.completed : oB.finishedAt !== false;
  
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
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
      <div className='med' title={Pref.salesOrder}>
        <i><i className='label'
          >{Pref.SO}:<br /></i>{oB.salesOrder}</i>
      </div>
      
      {!isDone ?
        <TideActivitySquare 
          batchID={oB._id} 
          acData={tBatch} />
      :
        <TideActivityData batchID={oB._id} />
      }
      
      <BatchTopStatus
        rowIndex={rowIndex}
        batchID={oB._id}
        tBatch={tBatch}
        app={app}
        isDebug={isDebug}
        statusCols={statusCols}
      />
    
      {!branchArea ?
        <ReleasedCheck
          batchID={oB._id}
          batchNum={oB.batch}
          tBatch={tBatch}
          isDone={isDone}
          releasedToFloor={releasedToFloor}
          releases={oB.releases}
          isAuth={isAuth}
          isRO={isRO} />
      : null}
      
      <BranchProgress
        batchID={oB._id}
        progCols={progCols}
        tBatch={tBatch}
        progType={prog}
        filterBy={filterBy}
        branchArea={branchArea}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
    
      <PerformanceSquare perf={tBatch.performTgt} mini={true} />
    
      <NonConCounts
        batchID={oB._id}
        tBatch={tBatch}
        releasedToFloor={releasedToFloor}
        ncCols={ncCols}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
    
      <ProJump batchNum={oB.batch} allRO={isRO} />
        
    </div>
  );
};

export default BatchDetailChunk;

export const ServeDetailChunk = ({ sv, isRO, isDebug })=> {
  
  const [ active, activeSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('serveActive', sv.mId, (err, re)=> {
      err && console.log(err);
      re && activeSet(re);
    });
    isDebug && console.log(sv);
  },[]);
  
  const stat = sv.pass ? 'Not Required' : sv.done ? 'Complete' : 'Incomplete';
  const acttl = active > 0 ? 'Started' : 'Unstarted';
  
  const late = !sv.pass && !sv.done && moment().isAfter(sv.due);
  const lattl = late ? 'Late' : 'Days Left';
  
  return(
    <div className='overGridRowScroll'>
      
      <div className='infoSquareOuter noCopy center' title={stat}>
        {sv.pass ?
          <n-fa2><i className='fa-solid fa-ban fa-2x fa-fw orangeT'></i></n-fa2>
        : sv.done ?
          <n-fa1><i className='fa-solid fa-clipboard-check fa-2x fa-fw greenT'></i></n-fa1>
        : <n-fa0><i className='fa-regular fa-clipboard fa-2x fa-fw grayT fade'></i></n-fa0> 
        }
        <i className='label infoSquareLabel'>{stat}</i>
      </div>
      
      <div className='infoSquareOuter noCopy center' title={acttl}>
        {active > 0 ?
          <n-fa3><i className='fa-solid fa-list-check fa-2x fa-fw greenT'></i></n-fa3>
        : <n-fa4><i className='fa-solid fa-bars fa-2x fa-fw grayT fade'></i></n-fa4>}
        <i className='label infoSquareLabel'>{acttl}</i>
      </div>

      <div className='med' title='Service Due'>
        <i><i className='label'>Due:<br /></i>{moment(sv.due).format("MMM Do")}</i>
      </div>
      
      <div className='infoSquareOuter noCopy center' title={lattl}>
        {late ?
          <n-fa5><i className='fa-solid fa-clock fa-2x fa-fw redT'></i></n-fa5>
        : <i className='medSm'>{round1Decimal(moment(sv.due).workingDiff(moment(), 'days', true))}</i>}
        <i className='label infoSquareLabel'>{lattl}</i>
      </div>
      
      <SrvJump find={sv.find} mId={sv.mId} isRO={isRO} />
      
    </div>
  );
};