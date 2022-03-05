import React, { Fragment } from 'react';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const DownstreamHeaders = ({
  indexKey, oB, traceDT,
  user, app,
  isDebug,
  focusBy, tagBy, dense, stormy
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
              tagBy={tagBy}
              dense={dense}
              stormy={stormy}
            />
      )}})}
    
  </Fragment>
);

export default DownstreamHeaders;


const DownstreamFixedChunk = ({
  ck, tBatch, topRapid,
  app, user, isDebug, focusBy, tagBy, dense, stormy
})=> {
  
  const isDone = ck.completedAt ? true : false;
  
  let what = tBatch.isWhat ? tBatch.isWhat.join(' ') : 'unavailable';
  let describe = tBatch.describe || '';
  
  const highG = focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
  let storm = stormy === false ? '' :
        stormy === 0 && tBatch.stormy[0] !== true ||
        stormy === 1 && tBatch.stormy[1] !== true ||
        stormy === 2 && tBatch.stormy[2] !== true ? 'clearall' : '';

  isDebug && console.log(ck.batch+'='+ck.batchID);
  
  return(
    <div className={`downRowFixed ${highG} ${highT} ${storm}`}>
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