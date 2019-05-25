import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';


const BatchHeaders = ({hB, lB, cB, bCache, hotheader, lukeheader, coolheader})=> {
  
  return(
    <div className='overGridFixed'>
      
      <div className='overGridRowFixedHeader' ref={hotheader}>
        <span id="hotBatch"
        // className='anchorTarget'
        ></span>
        <h1>Active{/*Pref.batches*/}</h1>
      </div>
      
      {!hB ? null :
        hB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}hotfixed${index}`}
              ck={entry}
              bCache={bCache} />
      )})}
      
      <div className='overGridRowFixedHeader' ref={lukeheader}>
        <span id="lukewarmBatch" 
        // className='anchorTarget'
        ></span>
        <h1>In Progress</h1>
      </div>
            
      {!lB ? null :
        lB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}lukefixed${index}`}
              ck={entry}
              bCache={bCache} />
      )})}
      
      <div className='overGridRowFixedHeader' ref={coolheader}>
        <span id="coolBatch"
        // className='anchorTarget'
        ></span>
        <h1>In Kitting</h1>
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
