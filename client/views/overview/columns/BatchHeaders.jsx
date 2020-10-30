import React from 'react';
// import Pref from '/client/global/pref.js';

import { PrioritySquare } from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const BatchHeaders = ({ oB, bCache, pCache, app, title })=> (
  <div className='overGridFixed'>
      
    <div id="allLiveBatch" className='overGridRowFixedHeader'>
      <span>{title} <sup>{oB.length}</sup></span>
    </div>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        return(
          <BatchHeaderChunk
            key={`${entry._id}livefixed${index}`}
            ck={entry}
            bCache={bCache}
            pCache={pCache}
            app={app} />
    )})}
    
  </div>
);

export default BatchHeaders;

const BatchHeaderChunk = ({ ck, source, bCache, pCache, app })=> {
  
  const isDone = ck.completed || ck.finishedAt ? true : false;
  const pt = pCache.dataSet.find( x => x.batchID === ck._id );
  
  const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === ck.batch) : false;
  const what = !moreInfo ? 'unavailable' : moreInfo.isWhat;
  
  const releasedToFloor = ck.releases.findIndex( 
                            x => x.type === 'floorRelease') >= 0 ? 
                            '' : 'ghostState';
                            
  return(
    <div className={`overGridRowFixed ${releasedToFloor}`}>
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
      <div>{what.length <= 50 ? what : what.substring(0, 50) + '...'}</div>
    </div>
  );
};
