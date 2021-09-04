import React, { Fragment } from 'react';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const DownstreamHeaders = ({
  indexKey, oB, traceDT,
  user, app,
  isDebug,
  focusBy, dense
})=> (
  <Fragment>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry.batchID );
        if(tBatch) {
          return(
            <DownstreamFixedChunk
              key={indexKey+'c'+index}
              ck={entry}
              tBatch={tBatch}
              topRapid={indexKey === -1}
              app={app}
              user={user}
              isDebug={isDebug}
              focusBy={focusBy}
              dense={dense}
            />
      )}})}
    
  </Fragment>
);

export default DownstreamHeaders;


const DownstreamFixedChunk = ({
  ck, tBatch, topRapid,
  app, user, isDebug, focusBy, dense 
})=> {
  
  const isDone = ck.completedAt ? true : false;
  
  let what = 'unavailable';
  let highG = '';
  let describe = '';
  
  what = tBatch.isWhat.join(' ');
  describe = tBatch.describe || '';
  highG = focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  isDebug && console.log(ck.batch+'='+ck.batchID);
  
  return(
    <div className={`downRowFixed ${highG}`}>
      <PrioritySquare
        batchID={ck.batchID}
        ptData={tBatch}
        isDone={isDone}
        oRapid={tBatch.oRapid}
        app={app}
        isDebug={isDebug}
        showLess={true}
      />
      <div>
        <ExploreLinkBlock 
          type='batch' 
          keyword={ck.batch}
          altName={topRapid ? tBatch.oRapid : false}
          wrap={false}
          rad={tBatch ? tBatch.rad : null}
        />
        </div>
      <div title={describe}
        >{what.length <= 75 ? what : what.substring(0, 75) + '...'}</div>
    </div>
  );
};