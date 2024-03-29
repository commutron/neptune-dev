import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const VariantLive = ({ vId, vKey, vState })=> {

  function handleVive(e) {
    Meteor.call('changeVive', vId, vKey, vState, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning(`Not changed. Live ${Pref.xBatchs} found`,
        { autoClose: false });
      }
    });
  }

  if(vState) {
    return(
      <button
        className='miniAction noFade med'
        title={`Archive ${Pref.variant}\nNO data will be deleted.`}
        onClick={(e)=>handleVive(e)}
        disabled={!Roles.userIsInRole(Meteor.userId(), ['edit'])}
      ><i><i className='fas fa-folder-open blueT fa-2x fa-fw'></i></i>
      <br /><small>Open</small>
      </button>
    );
  }
  
  return(
    <button
      className='miniAction noFade med'
      title={`Re-activate ${Pref.variant}`}
      onClick={(e)=>handleVive(e)}
      disabled={!Roles.userIsInRole(Meteor.userId(), ['edit'])}
    ><b><i className='fas fa-folder grayT fa-2x fa-fw'></i></b>
    <br /><small>Closed</small>
    </button>
  );
};

export default VariantLive;
