import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const EquipHibernate = ({ id, equip, connect })=> {

  function handle(flip) {
    Meteor.call('hibernateEquipment', id, flip, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/overview?request=maintain&specify=' + equip);
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);

  if(connect) {
    return(
      <button
        className='miniAction noFade med'
        title={`Currently Connected\nChange to Disconnected`}
        onClick={()=>handle(true)}
        disabled={!auth}
      ><n-fa1><i className='fa-solid fa-plug-circle-bolt greenT fa-2x fa-fw'></i></n-fa1>
      <br /><small>Connected</small>
      </button>
    );
  }
  
  return(
    <button
      className='miniAction noFade med'
      title={`Currently ${Pref.eqhib}\nChange to Connected`}
      onClick={()=>handle(false)}
      disabled={!auth}
    ><n-fa0><i className='fa-solid fa-plug-circle-xmark wetasphaltT fa-2x fa-fw'></i></n-fa0>
    <br /><small>{Pref.eqhib}</small>
    </button>
  );
};

export default EquipHibernate;
