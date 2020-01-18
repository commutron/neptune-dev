import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import PersonChunk from './PersonChunk.jsx';

const PeoplePanel = ({ 
  app, eUsers, dUsers, eBatches, bCache, 
  updatePhases, removePhaser, update 
})=> {
  
  const [ userChunks, setChunks ] = useState([]);
  
  useEffect( ()=>{
    let chunks = [];
    for( let u of eUsers ) {
      const batchMatch = eBatches.find( 
        x => x.tide && x.tide.find(  y => y.tKey === u.engaged.tKey ) 
      );
      const uTide = batchMatch && batchMatch.tide.find(  y => y.tKey === u.engaged.tKey );
      if(uTide) {
        chunks.push({
          uID: u._id,
          batch: batchMatch.batch,
          tideBlock: uTide,
        });
      }
    }
    const nmrlChunks = chunks.sort((x1, x2)=> {
      if (x1.batch < x2.batch) { return 1 }
      if (x1.batch > x2.batch) { return -1 }
      return 0;
    });
    setChunks(nmrlChunks);
  }, [eUsers, update]);
  
  Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({userChunks});
  
  const clientTZ = moment.tz.guess();
   
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
                updatePhases={(id, ph)=>updatePhases(id, ph)}
                removePhaser={(id)=>removePhaser(id)}
                update={update}
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