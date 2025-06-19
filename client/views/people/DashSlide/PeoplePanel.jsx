import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice';

import PersonChunk from './PersonChunk';

const PeoplePanel = ({ 
  eUsers, lUsers, dUsers, openTBlockState, traceDT,
  updateBranches, removeBranch, update, isDebug
})=> {
  
  const [ userChunks, setChunks ] = useState([]);
  
  useEffect( ()=>{
    const openTBlocks = JSON.parse(openTBlockState);
    const nmrlChunks = openTBlocks.sort((x1, x2)=> 
                        x1.tideBlock.startTime < x2.tideBlock.startTime ? 1 :
                        x1.tideBlock.startTime > x2.tideBlock.startTime ? -1 : 0);
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
          {userChunks.map( (entry, index)=>{
            return(
              <PersonChunk 
                key={entry.uID+'-'+index}
                userChunk={entry}
                traceDT={traceDT}
                updateBranches={(id, ph)=>updateBranches(id, ph)}
                removeBranch={(id)=>removeBranch(id)}
                update={update}
                isDebug={isDebug} />
          )})}
        </tbody>
      </table>
    
      <IdleList userList={lUsers} title={`Logged In - ${Pref.engagedNot}`} />
      
      <IdleList userList={dUsers} title='Logged Out' />
    </div>
  );
};

export default PeoplePanel;

const IdleList = ({ userList, title })=> (
  <div className='w100 vmargin cap'>
    <h3 className='med indent10'>{title}</h3>
    <div className='autoColGrid'>
      {(userList || []).map( (entry)=>{
        const pro = entry.proTimeShare?.[0]?.timeAsDecimal || 0;
        return(
          <div key={entry._id} className='colNoWrap maxWide bottomLine spacehalf'>
            <UserNice id={entry._id} />
            <em className='smaller'>{pro == 0 ? "Non-Production" : `${Math.round(pro*100)}% Production`}</em>
          </div>
      )})}
    </div>
  </div>
);