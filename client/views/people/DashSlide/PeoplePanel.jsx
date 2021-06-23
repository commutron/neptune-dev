import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import PersonChunk from './PersonChunk.jsx';

const PeoplePanel = ({ 
  app, eUsers, dUsers, openTBlockState, traceDT,
  updateBranches, removeBranch, update, isDebug
})=> {
  
  const [ userChunks, setChunks ] = useState([]);
  
  useEffect( ()=>{
    const openTBlocks = JSON.parse(openTBlockState);
    const nmrlChunks = openTBlocks.sort((x1, x2)=> {
      if (x1.batch < x2.batch) { return 1 }
      if (x1.batch > x2.batch) { return -1 }
      return 0;
    });
    setChunks(nmrlChunks);
  }, [eUsers, openTBlockState, update]);
  
  isDebug && console.log({userChunks});
   
  return(
    <div>
      <table className='wide cap space'>
        <tbody key='engagedpeoplescope0'>
          <tr className='leftText line2x medBig'>
            <th colSpan='5'>{Pref.engaged} with a {Pref.xBatch}</th>
          </tr>
          {userChunks.map( (entry, index)=>{
            return(
              <PersonChunk 
                key={entry.uID}
                userChunk={entry}
                traceDT={traceDT}
                app={app}
                updateBranches={(id, ph)=>updateBranches(id, ph)}
                removeBranch={(id)=>removeBranch(id)}
                update={update}
                isDebug={isDebug} />
          )})}
        </tbody>
      </table>

      <div className='wide space cap'>
        <h3>{Pref.engagedNot}</h3>
        <ul className='autoGrid'>
          {dUsers.map( (entry, index)=>{
            if(entry.proTimeShare && entry.proTimeShare[0].timeAsDecimal > 0) {
              return(
                <li key={entry._id} className='leftText line2x'>
                  <UserNice id={entry._id} />
                </li>
          )}})}
        </ul>
      </div>
    </div>
  );
};

export default PeoplePanel;