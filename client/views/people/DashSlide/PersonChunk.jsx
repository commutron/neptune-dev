import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice';
import { TaskTagLite } from '/client/components/tide/TaskTag';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';

const PersonChunk = ({ 
  userChunk, traceDT,
  updateBranches, removeBranch, update, 
  isDebug
})=> {
  
  const uC = userChunk;
  
  const [ branchGuess, setGuess ] = useState(false);
  
  useEffect( ()=>{
    if(userChunk.tideBlock.task) {
      const sub = userChunk.tideBlock.subtask;
      if(sub) {
        setGuess([ 'fromUserInput', [ userChunk.tideBlock.task + ', ' + sub ] ]);
      }else{
        setGuess([ 'fromUserInput', [ userChunk.tideBlock.task ] ]);
      }
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
  
  const project = userChunk.project;
  const equip = project?.split(" ~ ")?.[0]?.split("-")[1];
  
  const maint = userChunk.tideBlock.type === 'MAINT';
  
  const moreInfo = maint ? false : traceDT?.find( x => x.batch === uC.batch);
  const what = maint ? (project?.split(" ~ ")?.[1]?.split("<*>")?.[0] || 'Scheduled')
                          + ' Service' : moreInfo?.isWhat.join(' ') || 'unavailable';
  const rad = maint ? null : moreInfo?.rad || null;
  
  return(
    <tr className='leftText numFont'>
      <td className='noRightBorder'><UserNice id={uC.uID} /></td>
      <td className='noRightBorder'>
        <TaskTagLite task={branchGuess[1]} guess={branchGuess[0] === 'fromUserInput'} />
      </td>
      <td className='noRightBorder'>
        {project ?
          <ExploreLinkBlock type='equip' keyword={equip} /> :
          <ExploreLinkBlock type='batch' keyword={uC.batch} rad={rad} />
        }
      </td>
      <td className='noRightBorder'>{what}</td>
      <td className='noRightBorder centreText'>
        {moment(uC.tideBlock.startTime).isSameOrBefore(moment().startOf('day')) ?
          <em title='Time has been running for more than a day'>
            <i className="fas fa-exclamation-triangle fa-fw fa-xs yellowT"></i>
          </em> 
        :
          <b title='Start Time'>
          {uC.tideBlock.focus ?
            <i className='fa-solid fa-layer-group fa-fw fa-xs tealT'
            title={`Multi-tasking ${uC.tideBlock.focus} ${Pref.xBatchs}`}></i> 
          :
            <i className="fa-solid fa-play fa-fw fa-xs greenT"></i>}
          </b>
        }
        <i> {moment(uC.tideBlock.startTime).format('hh:mm A')}</i>
      </td>
    </tr>

  );
};

export default PersonChunk;