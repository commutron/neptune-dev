import React from 'react';
import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const BatchHeaders = ({ oB, bCache, dense })=> {
  
  return(
    <div className='overGridFixed'>
        
      <div id="allLiveBatch" className='overGridRowFixedHeader'>
        <h1>All Live <sup>{oB.length}</sup></h1>
      </div>
      
      {!dense ? null :
        <div className='overGridRowFixedHeader'></div>}
            
      {!oB ? null :
        oB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}livefixed${index}`}
              ck={entry}
              bCache={bCache} />
      )})}
      
    </div>
  
  );
};

export default BatchHeaders;

const BatchHeaderChunk = ({ck, source, bCache})=> {

  const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === ck.batch) : false;
  const what = moreInfo ? moreInfo.isWhat : 'unavailable';
  
  return(
    <div className='overGridRowFixed'>
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      </div>
      <div>{what.length <= 50 ? what : what.substring(0, 50) + '...'}</div>
    </div>
  );
};
