import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const VariantLive = ({ vId, vKey, vState, selfclose })=> {

  function handleVive(e) {
    Meteor.call('changeVive', vId, vKey, vState, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning(`Not changed. Live ${Pref.batches} found`,
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
      ><i><i className='fas fa-folder-open blueT fa-2x fa-fw'></i></i><br />Live
      </button>
    );
  }
  
  return(
    <button
      className='miniAction noFade med'
      title={`Re-activate ${Pref.variant}`}
      onClick={(e)=>handleVive(e)}
    ><b><i className='fas fa-folder grayT fa-2x fa-fw'></i></b><br />Archived
    </button>
  );
};

export default VariantLive;
