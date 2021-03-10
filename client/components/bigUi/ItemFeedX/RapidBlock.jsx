import React from 'react';
import { toast } from 'react-toastify';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const RapidBlock = ({ 
  rapIs, rapidsData, seriesId, serial, done, 
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
  
  const rapDo = rapidsData.find( x => x._id === rapIs.rapId );
  
  return(
    <div key={rapIs.rapId} className='infoBlock rapid'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className='fas fa-project-diagram fa-lg fa-fw' 
              data-fa-transform='flip-v'
              title='Extend'
            ></i>
          </div>
          <div>{rapDo.rapid} - {rapDo.issueOrder}</div>
        </div>
        <div className='rightText'>
          <div>{cal(rapIs.assignedAt)}</div>
          <div className='rightAnchor'>
            <button
              className='miniAction'
              onClick={()=>popRapid()}
              disabled={!deleteAuth || rapIs.completed}
              ><i className='fas fa-ban fa-lg fa-fw'></i></button>
          </div>
        </div>
      </div>
      {rapIs.completed && 
        <p className='endComment'>
          Completed {cal(rapIs.completedAt)} by <UserNice id={rapIs.completedWho} />
        </p>}
    </div>
  );
};

export default RapidBlock;