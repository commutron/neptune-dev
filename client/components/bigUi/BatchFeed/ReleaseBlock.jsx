import React from 'react';
import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const ReleaseBlock = ({ id, isX, done, dt, icon, brancheS, cal })=>{

  const aK = dt.type;
  const niceB = brancheS.find( b => ( 'BRK' + b.brKey ) === aK );
  
  let actionString = 'Clearence';
  if(aK === 'floorRelease') {
    actionString = 'Released to the Floor';
  }else if(aK === 'pcbKitRelease') {
    actionString = `Ready ${Pref.baseSerialPart}s`;
  }else if(niceB) {
    actionString = `Ready ${niceB.common}`;
  }
  
  function handleCancel() {
    if(isX) {
      Meteor.call('cancelRelease', id, aK, (err)=>{
        err && console.log(err);
      });
    }else{
      Meteor.call('cancelReleaseLEGACY', id, aK, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  return(
    <n-feed-info-block class='genericEvent'>
      <n-feed-left-anchor>
         <i className={`${icon || 'fas fa-check-square'} fa-lg fa-fw`}></i>
      </n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title class='cap'>  
          <span>{actionString} by <UserNice id={dt.who} /></span>
          {dt.caution ? <span>Caution: {dt.caution}</span> : null}
          <span></span>
          <span>{cal(dt.time)}</span>
        </n-feed-info-title>
      </n-feed-info-center>
      <n-feed-right-anchor>
        <button
          title='Cancel'
          className='miniAction'
          onClick={()=>handleCancel()} 
          disabled={done || !Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])}
          readOnly={true}>
          <i className='fas fa-undo-alt fa-lg fa-fw'></i>
        </button>
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default ReleaseBlock;