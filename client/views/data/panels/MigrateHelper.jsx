import React, { useState, useEffect, Fragment } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';



const MigrateHelper = ({ allBatch, allXBatch })=> {

  function adminFORCERemoveOldBatch() {
    console.log('not yet');
    
    /*
    Meteor.call('adminFORCERemoveOldBatch');
    */
  }

  function findBinX(oldbatch) {
    return allXBatch.find( x => x.batch === oldbatch ) ? true : false;
  }
  
  

  return(
    <div className='balance space36v'>
    
      <div>
        <h3>Batch</h3>
        <ol>
          {allBatch.map( (entry, index)=>(
            <li 
              key={index}
              className='vmarginhalf'>
              <ExploreLinkBlock
                keyword={entry.batch}
                type='batch'
                />
              {findBinX(entry.batch) && 
                <button 
                  className='gap miniAction clearRed' 
                  onClick={()=>adminFORCERemoveOldBatch(entry.batch)}
                >DELETE</button>
              }
            </li>
          ))}
        </ol>
      </div>
      
      <div>
        <h3>XBatch</h3>
        <ol>
          {allXBatch.map( (entry, index)=>(
            <XLineItem
              key={index}
              entry={entry}
            />
          ))}
        </ol>
      </div>
    </div>
  );
};
  
export default MigrateHelper;


const XLineItem = ({ entry })=>{
  
  const [ tCheck, tCheckSet ] = useState(null);
  
  useEffect( ()=> {
    Meteor.call('checkForTide', entry._id, (err, re)=>{
      err && console.log(err);
      if(re) { tCheckSet(re) }
    });
  },[]);
  
  
  return(
    <li
      className='vmarginhalf'>
      <ExploreLinkBlock
        keyword={entry.batch}
        type='batch'
        />
      
      {tCheck === null ? '?' :
       tCheck === false ? <i className='fas fa-radiation'></i> : null}
    </li>
            
  );
};