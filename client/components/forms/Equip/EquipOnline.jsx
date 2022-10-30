import React from 'react';
import { toast } from 'react-toastify';

const EquipOnline = ({ id, equip, online })=> {

  function handle(line) {
    Meteor.call('onofflineEquipment', id, line, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/equipment/' + equip);
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);

  if(online) {
    return(
      <button
        className='miniAction noFade med'
        title={`Currently Online\nChange to Offline`}
        onClick={()=>handle(false)}
        disabled={!auth}
      ><n-fa1><i className='fa-solid fa-rss greenT fa-2x fa-fw' data-fa-transform="rotate-315 up-2"></i></n-fa1>
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
    ><n-fa0><i className='fa-solid fa-circle wetasphaltT fa-2x fa-fw' data-fa-transform="shrink-10 down-5"></i></n-fa0>
    <br /><small>Offline</small>
    </button>
  );
};

export default EquipOnline;