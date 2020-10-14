import React from 'react';
// import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const UpstreamHeaders = ({ oB, bCache, title, showMore })=> (
  <div className='overGridFixed'>
      
    <div id="allLiveBatch" className='overGridRowFixedHeader'>
      <span>{title} <sup>{oB.length}</sup></span>
    </div>
    
    {!oB ? null :
      oB.map( (entry, index)=>{
        return(
          <UpstreamHeaderChunk
            key={`${entry._id}livefixed${index}`}
            ck={entry}
            bCache={bCache} />
    )})}
    
  </div>
);

export default UpstreamHeaders;

const UpstreamHeaderChunk = ({ck, source, bCache })=> {

  const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === ck.batch) : false;
  const what = !moreInfo ? 'unavailable' : `${moreInfo.isWhat} ${moreInfo.more}`;
  return(
    <div className='overGridRowFixed'>
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      </div>
      <div>{what.length <= 75 ? what : what.substring(0, 75) + '...'}</div>
    </div>
  );
};
