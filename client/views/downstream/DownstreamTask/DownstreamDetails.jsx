import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import { min2hr } from '/client/utility/Convert';

import ProJump from '/client/components/smallUi/ProJump';
import TideActivityData, { TideActivitySquare } from '/client/components/tide/TideActivity';
import BranchProgress from '../../overview/columns/BranchProgress.jsx';
import NonConCounts from '../../overview/columns/NonConCounts.jsx';

const DownstreamDetails = ({
  indexKey, oB, traceDT,
  pCache,
  user, app,
  isDebug, isNightly,
  focusBy, dense, progCols, ncCols, updateTrigger
})=> (
  <Fragment>
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry.batchID );
        return(
          <DownstreamScrollChunk
            key={indexKey+'c'+index}
            ck={entry}
            tBatch={tBatch}
            pCache={pCache}
            app={app}
            user={user}
            isDebug={isDebug}
            focusBy={focusBy}
            dense={dense}
            progCols={progCols}
            ncCols={ncCols}
            updateTrigger={updateTrigger}
          />
    )})}
  </Fragment>
);

export default DownstreamDetails;


const DownstreamScrollChunk = ({
  ck, tBatch,
  pCache,
  app, user, focusBy, isDebug, dense, progCols, ncCols,
  updateTrigger
})=> {

  const isDone = ck.completedAt ? true : false;
  
  const q2t = ck.quote2tide;
  const q2tStatus = !q2t ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${min2hr(q2t)} hr remain` :
            'remaining time unknown';
  
  let highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';

  const releasedToFloor = tBatch.onFloor || false;
  
  return(
    <div className={`downRowScroll ${highG}`}>
      
      <div>
        <i><i className='label' title={Pref.salesOrder}
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
      
      {!isDone ?
        <div title={`${q2t} minutes`}>{q2tStatus}</div>
      : <div>{Pref.batch} {Pref.isDone}</div> }
      
      <BranchProgress
        batchID={ck.batchID}
        showTotal={true}
        progCols={progCols}
        app={app}
        filterBy={false}
        branchArea={false}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
        
      <NonConCounts
        batchID={ck.batchID}
        releasedToFloor={releasedToFloor}
        force={true}
        app={app}
        ncCols={ncCols}
        updateTrigger={updateTrigger}
        isDebug={isDebug} />
      
      <ProJump batchNum={ck.batch} dense={dense} />
      
    </div>
  );
};
      
      
  