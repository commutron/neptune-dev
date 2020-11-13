import React, { Fragment } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const DownstreamHeaders = ({
  indexKey, oB, traceDT,
  bCache, pCache, acCache,
  user, app, brancheS,
  isDebug, isNightly,
  focusBy, dense
})=> (
  <Fragment>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry.batchID );
        return(
          <DownstreamFixedChunk
            key={indexKey+'c'+index}
            ck={entry}
            tBatch={tBatch}
            bCache={bCache}
            pCache={pCache}
            acCache={acCache}
            app={app}
            user={user}
            isDebug={isDebug}
            focusBy={focusBy}
            dense={dense}
          />
    )})}
    
  </Fragment>
);

export default DownstreamHeaders;


const DownstreamFixedChunk = ({
  ck, tBatch,
  bCache, pCache, acCache, 
  app, user, isDebug, focusBy, dense 
})=> {
  
  const isDone = ck.completedAt ? true : false;
  const pt = pCache.find( x => x.batchID === ck.batchID );
  
  let what = 'unavailable';
  let highG = '';
  let describe = '';
  
  if(!tBatch) {
    console.log(ck.batch+': NO tBatch');
    const bInfo = bCache ? bCache.find( x => x.batch === ck.batch) : false;
    what = !bInfo ? 'unavailable' : bInfo.isWhat.join(' ');
    describe = bInfo.more;
    highG = bInfo && focusBy ? bInfo.isWhat[0] === focusBy ? '' : 'hide' : '';
  }else{
    what = !tBatch ? 'unavailable' : tBatch.isWhat.join(' ');
    describe = tBatch.describe;
    highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  }
  
  isDebug && console.log(ck.batch+'='+ck.batchID);
  
  return(
    <div className={`downRowFixed ${highG}`}>
      <PrioritySquare
        batchID={ck.batchID}
        ptData={pt}
        isDone={isDone}
        app={app}
        isDebug={isDebug}
        showLess={true}
      />
      <div><ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} /></div>
      <div title={describe}
        >{what.length <= 75 ? what : what.substring(0, 75) + '...'}</div>
    </div>
  );
};