import React, { useState, useEffect } from 'react';
import moment from 'moment';

import UserNice from '/client/components/smallUi/UserNice';
import TaskTag from '/client/components/tinyUi/TaskTag';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

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
  const rad = moreInfo ? moreInfo.rad : null;
  
  return(
    <tr className='leftText numFont'>
      <td className='noRightBorder'><UserNice id={uC.uID} /></td>
      <td className='noRightBorder'>
        <TaskTag task={branchGuess[1]} guess={branchGuess[0] === 'fromUserInput'} />
      </td>
      <td className='noRightBorder'>
        <ExploreLinkBlock type='batch' keyword={uC.batch} rad={rad} />
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