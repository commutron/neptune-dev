import React, { Fragment } from 'react';

import { BatchHeaderChunk } from '/client/views/overview/columns/BatchHeaders';

const DownstreamHeaders = ({
  indexKey, oB, traceDT,
  app,
  isDebug,
  focusBy, tagBy, stormy
})=> (
  <Fragment>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry.batchID );
        if(tBatch) {
          return(
            <BatchHeaderChunk
              key={indexKey+'c'+index}
              id={entry.batchID}
              batch={entry.batch}
              isDone={entry.completedAt ? true : false}
              topRapid={indexKey === -1}
              tBatch={tBatch}
              app={app}
              rowclss='downRowFixed'
              focusBy={focusBy}
              tagBy={tagBy}
              stormy={stormy}
              isDebug={isDebug}
            />
      )}})}
    
  </Fragment>
);

export default DownstreamHeaders;