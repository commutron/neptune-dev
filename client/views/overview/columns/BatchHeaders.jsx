import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';


const BatchHeaders = ({hB, lB, cB, bCache})=> {
  
  
  return(
    <div className='overGridFixed'>
      
      <div className='overGridRowFixedHeader'>
        <span id="hotBatch" className='anchorTarget'></span>
        <h1>Active{/*Pref.batches*/}</h1>
      </div>
      
      {!hB ? null :
        hB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}hotfixed${index}`}
              source='hot'
              ck={entry}
              bCache={bCache} />
      )})}
      
      <div className='overGridRowFixedHeader'>
        <span id="lukewarmBatch" className='anchorTarget'></span>
        <h1>In Progress</h1>
      </div>
            
      {!lB ? null :
        lB.map( (entry, index)=>{
          return(
            <BatchHeaderChunk
              key={`${entry._id}lukefixed${index}`}
              source='lukewarm'
              ck={entry}
              bCache={bCache} />
      )})}
      
      <div className='overGridRowFixedHeader'>
        <span id="coolBatch" className='anchorTarget'></span>
        <h1>Pending</h1>
      </div>
      
      {!cB ? null :
        cB.map( (entry, index)=>{
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
