import React from 'react';

import BatchHeaderChunk from './BatchHeaderChunk';
import ServeHeaderChunk from './ServeHeaderChunk';

const BatchHeaders = ({ 
  oB, hB, sV, traceDT,
  app, isDebug, title,
  holdShow, holdshowSet,
  focusBy, tagBy, stormy
})=> (
  <div className='overGridFixed'>
    
    {sV &&
      sV.map( (entry, index)=>{
        return(
          <ServeHeaderChunk
            key={`${entry.mId}servefixed${index}`}
            sv={entry}
            rowclss='overGridRowFixed midnightGlow'
            isDebug={isDebug}
          />
    )})}
      
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