import React from 'react';
import moment from 'moment';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';


const BatchHeaders = ({hB, lB, cB, bCache})=> {
  
  
  return(
    <div className='overGridFixed'>
      
      {hB.map( (entry, index)=>{
        return(
          <BatchHeaderChunk
            key={`${entry._id}hotfixed${index}`}
            source='hot'
            ck={entry}
            bCache={bCache} />
              
      )})}
            
      {lB.map( (entry, index)=>{
        return(
          <BatchHeaderChunk
            key={`${entry._id}lukefixed${index}`}
            source='luke'
            ck={entry}
            bCache={bCache} />
              
      )})}
      
      {cB.map( (entry, index)=>{
        return(
          <BatchHeaderChunk
            key={`${entry._id}coolfixed${index}`}
            source='cool'
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
    <div className='overGridRowFixed' title={source}>
      <div>
        <ExploreLinkBlock type='batch' keyword={ck.batch} wrap={false} />
      </div>
      <div>{what.length <= 50 ? what : what.substring(0, 50) + '...'}</div>
    </div>
  );
};
