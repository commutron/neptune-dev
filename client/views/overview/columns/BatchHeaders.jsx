import React from 'react';
import moment from 'moment';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';


const BatchHeaders = ({wB, cB, bCache})=> {

  return(
    <div className='overGridFixed'>
      
      <div className='overGridHeaderFixed'>
        <div>Work Order</div>
        <div>Product</div>
      </div>
            
      {wB.map( (entry, index)=>{
        return(
          <BatchHeaderChunk
            key={`${entry._id}warmfixed${index}`}
            ck={entry}
            bCache={bCache} />
              
      )})}
      
      {cB.map( (entry, index)=>{
        return(
          <BatchHeaderChunk
            key={`${entry._id}coolfixed${index}`}
            ck={entry}
            bCache={bCache} />
      )})}
    </div>
  
  );
};

export default BatchHeaders;

const BatchHeaderChunk = ({ck, bCache})=> {

  const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === ck.batch) : false;
  const what = moreInfo ? moreInfo.isWhat : 'unavailable';
  
  return(
    <div className='overGridRowFixed'>
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} />
      </div>
      <div>{what.length <= 30 ? what : what.substring(0, 30) + '...'}</div>
    </div>
  );
};
