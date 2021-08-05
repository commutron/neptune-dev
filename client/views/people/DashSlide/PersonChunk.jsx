import React, { useState, useEffect } from 'react';
//import { toast } from 'react-toastify';
import moment from 'moment';
//import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import TaskTag from '/client/components/tinyUi/TaskTag.jsx';
import { LeapTextLink } from '/client/components/tinyUi/LeapText.jsx';

const PersonChunk = ({ 
  userChunk, traceDT, app,
  updateBranches, removeBranch, update, 
  isDebug
})=> {
  
  const uC = userChunk;
  
  const [ branchGuess, setGuess ] = useState(false);
  
  useEffect( ()=>{
    if(userChunk.tideBlock.task) {
      setGuess([ 'fromUserInput', [ userChunk.tideBlock.task ] ]);
    }else{
      Meteor.call('getOneBranchBestGuess', userChunk.batch, userChunk.tideBlock,
      (err, asw)=>{
        err && console.log(err);
        asw && setGuess(asw);
      });
    }
  }, [userChunk, update]);
  
  useEffect( ()=>{
    if(branchGuess) {
      branchGuess[1].forEach( (gu, ix) => updateBranches(userChunk.uID+ix, gu) );
    }
  }, [branchGuess]);
  
  useEffect( ()=>{
    return ()=>removeBranch(userChunk.uID);
  }, []);
  
  isDebug && console.log(branchGuess);
  
  const moreInfo = traceDT ? traceDT.find( x => x.batch === uC.batch) : false;
  const what = moreInfo ? moreInfo.isWhat.join(' ') : 'unavailable';
            
  return(
    <tr className='leftText line2x numFont'>
      <td className='noRightBorder medBig'><UserNice id={uC.uID} /></td>
      <td className='noRightBorder'>
        <TaskTag task={branchGuess[1]} guess={branchGuess[0] === 'fromUserInput'} />
      </td>
      <td className='noRightBorder'>
        <LeapTextLink
          title={uC.batch} 
          sty='numFont noWrap blackT'
          address={'/data/batch?request=' + uC.batch}
        />
      </td>
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