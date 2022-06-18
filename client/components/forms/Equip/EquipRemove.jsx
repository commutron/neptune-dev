import React from 'react';
import { toast } from 'react-toastify';

import ActionFunc from '/client/components/tinyUi/ActionFunc';

const EquipRemove = ({ id })=> {
  
  function deleteEquipment() {
    Meteor.call('deleteEquipment', id, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Removed');
        FlowRouter.go('/data/overview?request=maintain&specify=undefined');
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  const access = Roles.userIsInRole(Meteor.userId(), 'remove');
  
  return(
    <ActionFunc
      doFunc={()=>deleteEquipment()}
      title='Delete Equipment'
      icon='fa-solid fa-circle-minus'
      color='redT'
      lockOut={!access}
    />
  );
};

export default EquipRemove;