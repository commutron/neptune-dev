import React from 'react';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const UpstreamHeaders = ({ 
  oB, traceDT,
  app, isDebug,
  focusBy, title, showMore 
})=> (
  <div className='overGridFixed'>
      
    <div id="allLiveBatch" className='overGridRowFixedHeader'>
      <span>{title} <sup>{oB.length}</sup></span>
    </div>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry._id );
        return(
          <UpstreamHeaderChunk
            key={`${entry._id}livefixed${index}`}
            ck={entry}
            tBatch={tBatch}
            app={app}
            isDebug={isDebug}
            focusBy={focusBy} />
    )})}
  </div>
);

export default UpstreamHeaders;

const UpstreamHeaderChunk = ({ck, tBatch, app, isDebug, focusBy })=> {
  
  const isDone = ck.completed || ck.finishedAt ? true : false;

  const whaT = !tBatch ? 'unavailable' : `${tBatch.isWhat.join(' ')}`;
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  return(
    <div className={`overGridRowFixed ${highG}`}>
      <PrioritySquare
        batchID={ck._id}
        ptData={tBatch}
        isDone={isDone}
        oRapid={tBatch ? tBatch.oRapid : false}
        app={app}
        isDebug={isDebug}
        showLess={true}
      />
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      </div>
      <div title={tBatch ? tBatch.describe : 'unavailable'}
      >{whaT.length <= 50 ? whaT : whaT.substring(0, 50) + '...'}</div>
    </div>
  );
};
