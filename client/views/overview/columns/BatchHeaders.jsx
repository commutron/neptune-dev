import React from 'react';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const BatchHeaders = ({ 
  oB, traceDT,
  app, isDebug, title, focusBy, tagBy, stormy
})=> (
  <div className='overGridFixed'>
      
    <div id="allLiveBatch" className='overGridRowFixedHeader'>
      <span>{title} <sup>{oB.length}</sup></span>
    </div>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry._id );
        return(
          <BatchHeaderChunk
            key={`${entry._id}livefixed${index}`}
            ck={entry}
            tBatch={tBatch}
            app={app}
            isDebug={isDebug}
            focusBy={focusBy}
            tagBy={tagBy}
            stormy={stormy}
          />
    )})}
    
  </div>
);

export default BatchHeaders;

const BatchHeaderChunk = ({ ck, tBatch, app, isDebug, focusBy, tagBy, stormy })=> {
  
  const isDone = ck.completed || ck.finishedAt ? true : false;
  
  const whaT = !tBatch ? 'unavailable' : tBatch.isWhat.join(' ');
  const highG = tBatch && focusBy ? tBatch.isWhat[0] === focusBy ? '' : 'hide' : '';
  const highT = tagBy ? tBatch.tags && tBatch.tags.includes(tagBy) ? '' : 'hide' : '';
  
  const releasedToFloor = ck.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0 ? 
                            '' : 'ghostState';
  
  let storm = stormy === false ? '' :
        stormy === 0 && tBatch.stormy[0] !== true ||
        stormy === 1 && tBatch.stormy[1] !== true ||
        stormy === 2 && tBatch.stormy[2] !== true ? 'clearall' : '';
        
  return(
    <div className={`overGridRowFixed ${releasedToFloor} ${highG} ${highT} ${storm}`}>
      <PrioritySquare
        batchID={ck._id}
        ptData={tBatch}
        isDone={isDone}
        oRapid={tBatch ? tBatch.oRapid : null}
        app={app}
        isDebug={isDebug}
        showLess={true}
      />
      <div>
        <ExploreLinkBlock 
          type='batch' 
          keyword={ck.batch} 
          wrap={false} 
          rad={tBatch ? tBatch.rad : null}
        />
      </div>
      <div title={tBatch.describe}
        >{whaT.length <= 50 ? whaT : whaT.substring(0, 50) + '...'}</div>
    </div>
  );
};
