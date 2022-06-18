import React from 'react';
import { toast } from 'react-toastify';

import ActionFunc from '/client/components/tinyUi/ActionFunc';

const ServeRemove = ({ id, serveKey, lockOut })=> {
  
  function deleteService() {
    Meteor.call('removeServicePattern', id, serveKey, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Removed');
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  const access = Roles.userIsInRole(Meteor.userId(), 'edit');
  
  return(
    <ActionFunc
      doFunc={()=>deleteService()}
      title='Delete'
      icon='fa-solid fa-circle-minus'
      color='redT'
      lockOut={!access || lockOut}
    />
  );
};

export default ServeRemove;