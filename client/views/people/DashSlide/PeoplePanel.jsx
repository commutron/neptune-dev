import React, { useState, useEffect } from 'react';
//import { toast } from 'react-toastify';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const PeoplePanel = ({ app, eUsers, eBatches, bCache })=> {
  
  const [ userChunk, setChunk ] = useState([]);
  
  useEffect( ()=>{
    let chunk = [];
    for( let u of eUsers ) {
      const batchMatch = eBatches.find( 
        x => x.tide.find(  y => y.tKey === u.engaged.tKey ) 
      );
      const uTide = batchMatch.tide.find(  y => y.tKey === u.engaged.tKey );
      chunk.push({
        uID: u._id,
        batch: batchMatch.batch,
        tideBlock: uTide
      });
    }
    const nmrlChunk = chunk.sort((x1, x2)=> {
      if (x1.batch < x2.batch) { return 1 }
      if (x1.batch > x2.batch) { return -1 }
      return 0;
    });
    setChunk(nmrlChunk);
  }, [eUsers]);
  
  Roles.userIsInRole(Meteor.userId(), 'debug') && 
    console.log(userChunk);
   
   
  return(
    <div className='space'>
      <table className='wide cap space numFont'>
        <tbody key='0peoplescope0'>
          {userChunk.map( (entry, index)=>{
            const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === entry.batch) : false;
            const what = moreInfo ? moreInfo.isWhat : 'unavailable';
            return(
              <tr key={entry.tideBlock.tKey} className='leftText line2x'>
                <td className='noRightBorder medBig'><UserNice id={entry.uID} /></td>
                <td className='noRightBorder'>{entry.batch}</td>
                <td className='noRightBorder'>{what}</td>
                <td className='noRightBorder centreText'>
                  {moment(entry.tideBlock.startTime).isSameOrBefore(moment().startOf('day')) ?
                    <em title='Time has been running for more than a day'>
                      <i className="fas fa-exclamation-triangle fa-fw fa-xs yellowT"></i>
                    </em> :
                    <b title='Start Time'>
                      <i className="fas fa-play fa-fw fa-xs greenT"></i>
                    </b> }
                  <i> {moment(entry.tideBlock.startTime).format('hh:mm A')}</i>
                </td>
              </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default PeoplePanel;