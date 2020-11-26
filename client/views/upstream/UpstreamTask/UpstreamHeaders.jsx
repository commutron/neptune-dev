import React from 'react';
// import Pref from '/client/global/pref.js';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const UpstreamHeaders = ({ 
  oB, traceDT,
  app, title, focusBy, showMore 
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
            focusBy={focusBy} />
    )})}
  </div>
);

export default UpstreamHeaders;

const UpstreamHeaderChunk = ({ck, tBatch, bCache, app, focusBy })=> {
  
  const isDone = ck.completed || ck.finishedAt ? true : false;

  const whaT = !tBatch ? 'unavailable' : `${tBatch.isWhat.join(' ')} ${tBatch.describe}`;
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  return(
    <div className={`overGridRowFixed ${highG}`}>
      <PrioritySquare
        batchID={ck._id}
        ptData={tBatch}
        isDone={isDone}
        app={app}
        isDebug={false}
        showLess={true}
      />
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      </div>
      <div>{whaT.length <= 75 ? whaT : whaT.substring(0, 75) + '...'}</div>
    </div>
  );
};
