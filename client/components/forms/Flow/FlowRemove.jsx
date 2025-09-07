import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { MatchButton } from '/client/layouts/Models/Popover';

export const FlowRemove = ({ id, fKey, access })=>	{
  
  function pull() {
    Meteor.call('pullFlow', id, fKey, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        toast.warning('Cannot be removed, is currently in use');
      }else if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }

  const title = access ? 'delete process flow if not in use' : Pref.norole;
    
  return(
    <MatchButton 
      title={title}
      text='Delete Flow' 
      icon='fa-solid fa-minus-circle'
      doFunc={pull}
      lock={!access}
    />
  );
};

export default FlowRemove;