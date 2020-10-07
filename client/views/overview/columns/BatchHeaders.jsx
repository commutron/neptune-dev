import React from 'react';
// import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const BatchHeaders = ({ oB, bCache, title, showMore })=> {
  
  return(
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
              showMore={showMore} />
      )})}
      
    </div>
  
  );
};

export default BatchHeaders;

const BatchHeaderChunk = ({ck, source, bCache, showMore })=> {

  const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === ck.batch) : false;
  const what = !moreInfo ? 'unavailable' : 
                !showMore ? moreInfo.isWhat : `${moreInfo.isWhat} ${moreInfo.more}` ;
  const cut = !showMore ? 50 : 75;
  
  return(
    <div className='overGridRowFixed'>
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      </div>
      <div>{what.length <= cut ? what : what.substring(0, cut) + '...'}</div>
    </div>
  );
};
