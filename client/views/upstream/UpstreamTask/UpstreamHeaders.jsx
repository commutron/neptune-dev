import React from 'react';
// import Pref from '/client/global/pref.js';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const UpstreamHeaders = ({ 
  oB, traceDT,
  bCache, pCache,
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
            bCache={bCache}
            pCache={pCache}
            app={app}
            focusBy={focusBy} />
    )})}
  </div>
);

export default UpstreamHeaders;

const UpstreamHeaderChunk = ({ck, tBatch, bCache, pCache, app, focusBy })=> {
  
  const isDone = ck.completed || ck.finishedAt ? true : false;
  const pt = pCache.dataSet.find( x => x.batchID === ck._id );
  
  //const bInfo = bCache ? bCache.dataSet.find( x => x.batch === ck.batch) : false;
  //const what = !bInfo ? 'unavailable' : `${bInfo.isWhat.join(' ')} ${bInfo.more}`;
  const whaT = !tBatch ? 'unavailable' : `${tBatch.isWhat.join(' ')} ${tBatch.describe}`;
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  
  return(
    <div className={`overGridRowFixed ${highG}`}>
      <PrioritySquare
        batchID={ck._id}
        ptData={pt}
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
