import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';


const BatchHeaders = ({hB, lB, cB, bCache })=> {
  
  return(
    <div className='overGridFixed'>
      
      <div id="hotBatch" className='overGridRowFixedHeader'>
        <h1>Active <sup>{hB.length}</sup></h1>
      </div>
      
      {!hB ? null :
        hB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}hotfixed${index}`}
              ck={entry}
              bCache={bCache} />
      )})}
      
      <div id="lukewarmBatch" className='overGridRowFixedHeader'>
        <h1>In Progress <sup>{lB.length}</sup></h1>
      </div>
            
      {!lB ? null :
        lB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}lukefixed${index}`}
              ck={entry}
              bCache={bCache} />
      )})}
      
      <div id="coolBatch" className='overGridRowFixedHeader'>
        <h1>In Kitting <sup>{cB.length}</sup></h1>
      </div>
      
      {!cB ? null :
        cB.map( (entry, index)=>{
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
