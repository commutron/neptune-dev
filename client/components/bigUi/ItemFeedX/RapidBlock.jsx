import React from 'react';
import { toast } from 'react-toastify';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const RapidBlock = ({ 
  rapIs, rapDo, rapive, rapidsData, seriesId, serial, done, 
  deleteAuth, cal
})=> {
  
  function popRapid() {
    let check = 'Are you sure you want to remove the extention from this ' + Pref.item;
    const yes = window.confirm(check);
    if(yes) {
      Meteor.call('unsetRapidFork', seriesId, serial, rapIs.rapId, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Not Allowed');
      });
    }else{null}
  }
  
  const rarapid = rapDo ? rapDo.rapid : rapIs ? rapIs.rapId : '___';
  const raissue = rapDo ? rapDo.issueOrder : '___';
  
  return(
    <n-feed-info-block class='rapid'>
      <n-feed-left-anchor>
        <i className='fas fa-bolt fa-lg fa-fw' 
          title='Extend'
        ></i>
      </n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title class='cap'>
          <span>{rarapid}</span>
          <span>{raissue}</span>
          <span></span>
          <span>{cal(rapIs.assignedAt)}</span>
        </n-feed-info-title>
        {rapIs.completed && 
          <p>
            Completed {cal(rapIs.completedAt)} by <UserNice id={rapIs.completedWho} />
          </p>}
      </n-feed-info-center>
      <n-feed-right-anchor>
        <button
          className='miniAction'
          onClick={()=>popRapid()}
          disabled={!deleteAuth || rapIs.completed || !rapive}
          ><i className='fas fa-ban fa-lg fa-fw'></i>
        </button>
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default RapidBlock;