import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice';

import PersonChunk from './PersonChunk';

const PeoplePanel = ({ 
  app, eUsers, dUsers, openTBlockState, traceDT,
  updateBranches, removeBranch, update, isDebug
})=> {
  
  const [ userChunks, setChunks ] = useState([]);
  
  useEffect( ()=>{
    const openTBlocks = JSON.parse(openTBlockState);
    const nmrlChunks = openTBlocks.sort((x1, x2)=> 
                        x1.batch < x2.batch ? 1 : x1.batch > x2.batch ? -1 : 0);
    setChunks(nmrlChunks);
  }, [eUsers, openTBlockState, update]);
  
  isDebug && console.log({userChunks});
   
  return(
    <div>
      <table className='wide cap space'>
        <tbody key='engagedpeoplescope0'>
          <tr className='leftText line2x'>
            <th colSpan='5'>{Pref.engaged} with a {Pref.xBatch}</th>
          </tr>
          {userChunks.map( (entry)=>{
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

      <div className='w100 vmargin cap'>
        <h3 className='med indent10'>{Pref.engagedNot}</h3>
        <ul className='autoGrid'>
          {dUsers.map( (entry)=>{
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