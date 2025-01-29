import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const RapidSet = ({ seriesId, serial, rapidData, access })=> {
  
  const handleRapid = ()=> {
    this.dorapid.disabled = true;
    const rapId = rapidData._id;
    
    if(rapId) {
      Meteor.call('setRapidFork', seriesId, serial, rapId, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success(Pref.rapidExd);
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      toast.error(`No ${Pref.rapidEx} ID`);
    }
  };
  
  if(!access) {
    return null;
  }
  
  return(
    <ModelNative
      dialogId={serial+'_rapid_form'}
      title={`${Pref.rapidEx} ${Pref.item}`}
      icon='fa-solid fa-sitemap'
      colorT='darkOrangeT'
      dark={false}>
    <div className='min200'>
      <p className='centreText medBig'>{Pref.rapidEx} {serial}</p>
      <p className='centreText medBig'>on {rapidData.rapid} - {rapidData.issueOrder}</p>
      
      <form onSubmit={(e)=>handleRapid(e)}>
        <p className='centre vmargin'>
          <button
            id='dorapid'
            type='submit'
            formMethod='dialog'
            className='action darkOrangeSolid'
          >{Pref.rapidEx}</button>
        </p>
      </form>
    </div>
    </ModelNative>
  );
};

export default RapidSet;