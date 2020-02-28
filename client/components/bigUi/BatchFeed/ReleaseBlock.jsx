import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

import UserNice from '/client/components/smallUi/UserNice.jsx';


const ReleaseBlock = ({ id, isX, done, dt, icon })=>{

  const aK = dt.type;
  
  let actionString = aK === 'floorRelease' ? 
                      'Released to the Floor' : 'Released';
  for(let cl of Pref.clearencesArray) {
    if( aK === cl.keyword ) {
      actionString = `${cl.post} ${cl.link} ${cl.context}`;
      break;
    }
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
          <div className={`leftAnchor ${dt.caution ? 'yellowT' : 'greenT'}`}>
            <i className={`${icon || 'fas fa-check-square'} fa-lg fa-fw`}></i>
          </div>
          <div>{actionString} by <UserNice id={dt.who} /></div>
          {dt.caution ?
            <div>Caution: {dt.caution}</div>
          : null}
        </div>
        <div className='rightText'>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
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