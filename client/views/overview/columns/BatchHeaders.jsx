import React from 'react';

import BatchHeaderChunk from './BatchHeaderChunk';

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
            id={entry._id}
            batch={entry.batch}
            releases={entry.releases}
            isDone={entry.completed ? true : false}
            tBatch={tBatch}
            app={app}
            rowclss='overGridRowFixed'
            focusBy={focusBy}
            tagBy={tagBy}
            stormy={stormy}
            isDebug={isDebug}
          />
    )})}
    
  </div>
);

export default BatchHeaders;