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
    <div className='infoBlock genericEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className={`${icon || 'fas fa-check-square'} fa-lg fa-fw`}></i>
          </div>
          <div>{actionString} by <UserNice id={dt.who} /></div>
          {dt.caution ?
            <div>Caution: {dt.caution}</div>
          : null}
        </div>
        <div className='rightText'>
          <div>{cal(dt.time)}</div>
          <div className='rightAnchor'>
	          <button
	            title='Cancel'
              className='miniAction'
              onClick={()=>handleCancel()} 
              disabled={done || !Roles.userIsInRole(Meteor.userId(), ['run', 'kitting'])}
              readOnly={true}>
              <i className='fas fa-undo-alt fa-lg fa-fw'></i>
            </button>
	        </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseBlock;