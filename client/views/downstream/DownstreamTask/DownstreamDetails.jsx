import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import { min2hr } from '/client/utility/Convert';

import ProJump from '/client/components/smallUi/ProJump';
import TideActivityData, { TideActivitySquare } from '/client/components/tide/TideActivity';
import BranchProgress from '../../overview/columns/BranchProgress.jsx';
import NonConCounts from '../../overview/columns/NonConCounts.jsx';


const DownstreamDetails = ({
  oB, indexKey,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  focusBy, dense, progCols, ncCols, updateTrigger
})=> (
  <Fragment>
    {!oB ? null :
      oB.map( (entry, index)=>{
        return(
          <DownstreamScrollChunk
            ck={entry}
            key={indexKey+'c'+index}
            bCache={bCache}
            pCache={pCache}
            acCache={acCache}
            app={app}
            user={user}
            isDebug={isDebug}
            brancheS={brancheS}
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
  ck,
  bCache, pCache, acCache, 
  app, user, brancheS, focusBy, isDebug, dense, progCols, ncCols,
  updateTrigger
})=> {

  const isDone = ck.completedAt ? true : false;
  
  const q2t = ck.quote2tide;
  const q2tStatus = !q2t ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${min2hr(q2t)} hours remain` :
            'remaining time unknown';
  
  const bInfo = focusBy && bCache ? bCache.find( x => x.batch === ck.batch) : false;
  const highG = bInfo ? bInfo.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  const ac = acCache.find( x => x.batchID === ck.batchID );
  
  //const releasedToFloor = oB.releases.findIndex( 
    //                      x => x.type === 'floorRelease') >= 0;
  const releasedToFloor = false;
  
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
          acData={ac}
          isDebug={isDebug} />
      :
        <TideActivityData
          batchID={ck.batchID}
          isDebug={isDebug} />
      }    
      </div>
      
      {!isDone ?
        <div title={`${q2t} minutes`}>{q2tStatus}</div>
      : <div>{Pref.batch} is {Pref.isDone}</div> }
      
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
      
      
  