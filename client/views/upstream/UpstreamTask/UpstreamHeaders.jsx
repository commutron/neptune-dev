import React from 'react';

import BatchHeaderChunk from '/client/views/overview/columns/BatchHeaderChunk';

const UpstreamHeaders = ({ 
  oB, hB, traceDT,
  app, isDebug, holdShow, holdshowSet,
  focusBy, tagBy, title 
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
    
    {hB.length > 0 &&
      <button 
        id="allHoldBatch" 
        className='overGridRowFixedHeader grayFade'
        onClick={()=>holdshowSet(!holdShow)}
      >
        <span>
        {holdShow ?
          <n-fa0><i className="fa-solid fa-angles-down gapR"></i></n-fa0> :
          <n-fa1><i className="fa-solid fa-angles-right gapR"></i></n-fa1>
        }On Hold <sup>{hB.length}</sup>
        </span>
      </button>
    }
    
    {holdShow &&
      hB.map( (entry, index)=>{
        const tBatch = traceDT.find( t => t.batchID === entry._id );
        return(
          <BatchHeaderChunk
            key={`${entry._id}holdfixed${index}`}
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