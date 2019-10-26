import React, { useState, useEffect } from 'react';
//import { toast } from 'react-toastify';
import moment from 'moment';
//import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';


const PersonChunk = ({ 
  userChunk, bCache, app, 
  updatePhases, removePhaser, update, clientTZ
})=> {
  
  const uC = userChunk;
  
  const [ phaseGuess, setGuess ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('phaseBestGuess', 
    userChunk.uID, 
    userChunk.batch,
    userChunk.tideBlock.startTime,
    false,
    clientTZ,
    (err, asw)=>{
      err && console.log(err);
      asw && setGuess(asw);
    });
  }, [userChunk.batch, update]);
  
  useEffect( ()=>{
    if(phaseGuess) {
      phaseGuess[1].forEach( (gu, ix) => updatePhases(userChunk.uID+ix, gu) );
    }
  }, [phaseGuess]);
  
  useEffect( ()=>{
    return ()=>removePhaser(userChunk.uID);
  }, []);
  
  Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(phaseGuess);
  
  const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === uC.batch) : false;
  const what = moreInfo ? moreInfo.isWhat : 'unavailable';
   
  return(
    <tr className='leftText line2x numFont'>
      <td className='noRightBorder medBig'><UserNice id={uC.uID} /></td>
      <td className='noRightBorder'>
        {!phaseGuess ? 
          <i className='clean small'>unknown</i> 
        : 
          phaseGuess[1].join(', ')
        }
      </td>
      <td className='noRightBorder'>{uC.batch}</td>
      <td className='noRightBorder'>{what}</td>
      <td className='noRightBorder centreText'>
        {moment(uC.tideBlock.startTime).isSameOrBefore(moment().startOf('day')) ?
          <em title='Time has been running for more than a day'>
            <i className="fas fa-exclamation-triangle fa-fw fa-xs yellowT"></i>
          </em> 
        :
          <b title='Start Time'>
            <i className="fas fa-play fa-fw fa-xs greenT"></i>
          </b>
        }
        <i> {moment(uC.tideBlock.startTime).format('hh:mm A')}</i>
      </td>
    </tr>

  );
};

export default PersonChunk;