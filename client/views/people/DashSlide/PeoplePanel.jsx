import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import PersonChunk from './PersonChunk.jsx';

const PeoplePanel = ({ 
  app, eUsers, dUsers, openTBlockState, bCache,
  updateBranches, removeBranch, update, 
  clientTZ, isDebug
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
          <tr className='leftText line2x big'>
            <th colSpan='5'>{Pref.engaged} with a {Pref.batch}</th>
          </tr>
          {userChunks.map( (entry, index)=>{
            return(
              <PersonChunk 
                key={entry.uID}
                userChunk={entry}
                bCache={bCache}
                app={app}
                updateBranches={(id, ph)=>updateBranches(id, ph)}
                removeBranch={(id)=>removeBranch(id)}
                update={update}
                isDebug={isDebug}
                clientTZ={clientTZ} />
          )})}
        </tbody>
      </table>
      <p className='vmargin' />
      <table className='wide cap space'>
        <tbody key='dormantpeoplescope0'>
          <tr className='leftText line2x big'>
            <th colSpan='5'>{Pref.engagedNot}</th>
          </tr>
          {dUsers.map( (entry, index)=>{
            return(
              <tr key={entry._id} className='leftText line2x'>
                <td 
                  colSpan='4' 
                  className='noRightBorder medBig'
                ><UserNice id={entry._id} /></td>
              </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default PeoplePanel;