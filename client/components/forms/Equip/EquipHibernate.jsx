import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import ModelInline from '/client/layouts/Models/ModelInline';

const EquipHibernate = ({ id, equip, connect, auth })=> {

  function handle(flip) {
    Meteor.call('hibernateEquipment', id, flip, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/equipment/' + equip);
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
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

export const EquipNullify = ({ id, equip })=> {

  function handleNullEq() {
    Meteor.call('nullifyEquipment', id, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        FlowRouter.go('/equipment/' + equip);
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  return(
		<div className='fakeFielset vmargin'>
      <ModelInline 
        title='Decommission Equipment'
        color='wet' 
        border='borderOrange'
        icon='fa-solid fa-dumpster'
      >
        <div className='centre'>
          <p>Permanently shutdown this equipment.</p>
          <p>All Service Schedules and Preventive Maintenance records will be deleted.</p>
          <button
            type='button'
            id='yesnulleq'
            title='Confirm Decommission'
            className='action orangeSolid'
            onClick={()=>handleNullEq()}
          >Yes, Decommission</button>
        </div>
      </ModelInline>
    </div>
  );
};