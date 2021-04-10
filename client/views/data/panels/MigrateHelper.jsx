import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';



const MigrateHelper = ({ allBatch, allXBatch })=> {
  
  const [ rmaList, rmaListSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('findAllCascade', (err, re)=>{
      err && console.error(err);
      re && rmaListSet(re);
    });
    
  }, []);
  
  function handleFORCERemove(batchID, batchNUM) {
    Meteor.call('adminFORCERemoveOldBatch', batchID, batchNUM, (err)=>{
      err && console.error(err);
    });
  }

  function findBinOLD(newbatch) {
    return allBatch.find( x => x.batch === newbatch ) ? true : false;
  }
  
  function findBinX(oldbatch) {
    return allXBatch.find( x => x.batch === oldbatch ) ? true : false;
  }
  
  
  const allXBatcheS = allXBatch.sort( (x1, x2)=>
          x1 > x2 ? 1 : x1 < x2 ? -1 : 0);
          
  const allBatcheS = allBatch.sort( (b1, b2)=>
          b1 > b2 ? 1 : b1 < b2 ? -1 : 0);
  
  return(
    <div className='balance space36v'>
      
      <div>
        <h3>XBatch</h3>
        <ol>
          {allXBatcheS.map( (entry, index)=>(
            <li
              key={index}
              className='vmarginhalf'>
              <ExploreLinkBlock
                keyword={entry.batch}
                type='batch'
              />
              {findBinOLD(entry.batch) &&
                <n-fa1><i className='gap orangeT fas fa-radiation'></i></n-fa1>
              }
            </li>
          ))}
        </ol>
      </div>
      
      
      <div className='infoBox'>
        <h3>Batch</h3>
        <ol>
          {allBatcheS.map( (entry, index)=>(
            <li 
              key={index}
              className='vmarginhalf'>
              <ExploreLinkBlock
                keyword={entry.batch}
                type='batch'
              />
              {findBinX(entry.batch) &&
                <button 
                  className='gap miniAction line2x clearRed' 
                  onClick={()=>handleFORCERemove(entry._id, entry.batch)}
                >_DELETE_</button>
              }
            </li>
          ))}
        </ol>
      </div>
      
      
      <div>
        <h3>RMAs</h3>
        <ol>
          {rmaList && rmaList.map( (entry, index)=>(
            <li 
              key={index}
              className='vmarginhalf'
            ><ExploreLinkBlock
                keyword={entry[0]}
                type='batch'
              /> = {entry[1]} </li>
          ))}
        </ol>
      </div>
      
    </div>
  );
};
  
export default MigrateHelper;