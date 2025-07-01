import React from 'react';
import { toast } from 'react-toastify';

const EquipOnline = ({ id, equip, online, auth })=> {

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
  
  if(online) {
    return(
      <button
        className='miniAction noFade med'
        title={`Currently Online\nChange to Offline`}
        onClick={()=>handle(false)}
        disabled={!auth}
      ><n-fa1 class='block'>
        <i className='fa-solid fa-power-off greenT fa-2x fa-fw'></i>
      </n-fa1>
      <small>Online</small>
      </button>
    );
  }
  
  return(
    <button
      className='miniAction noFade med'
      title={`Currently Offline\nChange to Online`}
      onClick={()=>handle(true)}
      disabled={!auth}
    ><n-fa0 class='fa-stack fa-2x fa-fw block faLayerCorrect'>
        <i className="fa-solid fa-slash wetasphaltT fa-stack-1x"></i>
        <i className="fa-solid fa-power-off wetasphaltT fa-stack-1x"></i>
      </n-fa0>
      <small>Offline</small>
    </button>
  );
};

export default EquipOnline;