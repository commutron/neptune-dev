import React from 'react';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const EquipOnline = ({ id, equip, online })=> {

  function handle(line) {
    Meteor.call('onofflineEquipment', id, line, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/data/overview?request=maintain&specify=' + equip);
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'edit');

  if(online) {
    return(
      <button
        className='miniAction noFade med'
        title={`Currently Online\nChange to Offline`}
        onClick={()=>handle(false)}
        disabled={!auth}
      ><n-fa1><i className='fa-solid fa-plug-circle-bolt blueT fa-2x fa-fw'></i></n-fa1>
      <br /><small>Online</small>
      </button>
    );
  }
  
  return(
    <button
      className='miniAction noFade med'
      title={`Currently Offline\nChange to Online`}
      onClick={()=>handle(true)}
      disabled={!auth}
    ><n-fa0><i className='fa-solid fa-plug-circle-xmark grayT fa-2x fa-fw'></i></n-fa0>
    <br /><small>Offline</small>
    </button>
  );
};

export default EquipOnline;
