import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const GroupInternalWrapper = ({ id, iState, noText, primeTopRight, access })=> {
  const actTtl = !iState ? `Set Internal ${Pref.group}` : 
                           `Unset Internal ${Pref.group}`;
  
  const aT = !access ? Pref.norole : '';
  const title = access ? actTtl : aT;
  
  return(
    <ModelSmall
      button='Internal'
      title={title}
      color='grayT'
      icon='fa-home'
      lock={!access}
      noText={noText}
      primeTopRight={primeTopRight}>
      <GroupInternal
        id={id}
        iState={iState}
      />
    </ModelSmall>
  );
};

export default GroupInternalWrapper;

const GroupInternal = ({ id, iState, selfclose })=> {

  function handleInterize(e) {
    Meteor.call('internalizeGroup', id, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.warning('Not internalized');
      }
    });
  }

  if(!iState) {
    return(
      <div className='centre cap'>
        <p>Set {Pref.group} for internal use. One-off projects, prototypes, or training.</p>
        <p>{Pref.widgets} will be left out of broad statistics</p>
        <p>
          <button
            className='action clearBlack'
            onClick={(e)=>handleInterize(e)}
          >Set {Pref.group}</button>
        </p>
      </div>
    );
  }
  
  return(
    <div className='centre'>
      <p>Internal flag will be removed from {Pref.group}</p>
      <p>
        <button
          className='action clearBlack'
          onClick={(e)=>handleInterize(e)}
        >Unset {Pref.group}</button>
      </p>
    </div>
  );
};