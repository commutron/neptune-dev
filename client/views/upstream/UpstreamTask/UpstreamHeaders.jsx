import React from 'react';

import BatchHeaderChunk from '/client/views/overview/columns/BatchHeaderChunk';

const UpstreamHeaders = ({ 
  oB, traceDT,
  app, isDebug,
  focusBy, tagBy, title, showMore 
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
            isDone={entry.completed ? true : false}
            tBatch={tBatch}
            app={app}
            rowclss='overGridRowFixed'
            nameLth={50}
            focusBy={focusBy}
            tagBy={tagBy}
            isDebug={isDebug}
          />
    )})}
  </div>
);

export default UpstreamHeaders;