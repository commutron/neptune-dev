import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const RapidSet = ({ seriesId, serial, rapidData, access })=> {
  
  const handleRapid = (e)=> {
    this.dorapid.disabled = true;
    const rapId = rapidData._id;
    
    if(rapId) {
      Meteor.call('setRapidFork', seriesId, serial, rapId, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success(Pref.rapidExd);
          // selfclose();
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
      title={`${Pref.rapidEx} ${Pref.item} ${serial}`}
      icon='fa-solid fa-sitemap'
      colorT='darkOrangeT'
      dark={false}>
    <div>
      <p className='centreText medBig bold vmargin'>Set {serial} on {Pref.rapidExn} {rapidData.rapid} - {rapidData.issueOrder}</p>
      
      <p className='centreText'><em>This action requires "qa", "run" or "inspect" permission.</em></p>
      
      <p className='centre vmargin'>
        <button
          id='dorapid'
          className='action darkOrangeSolid'
          onClick={(e)=>handleRapid(e)}
          disabled={false}
        >{Pref.rapidEx}</button>
      </p>
    </div>
    </ModelNative>
  );
};

export default RapidSet;