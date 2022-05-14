import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const RapidSet = ({ seriesId, serial, rapidData })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect']);
  const title = `${Pref.rapidEx} ${Pref.item} ${serial}`;
  
  return(
    <ModelSmall
      button={Pref.rapidEx}
      title={title}
      color='darkOrangeT'
      icon='fa-sitemap'
      lock={!access}
    >
      <RapidSetForm
        seriesId={seriesId}
        serial={serial}
        rapidData={rapidData}
      />
    </ModelSmall>
  );
};

export default RapidSet;

const RapidSetForm = ({ seriesId, serial, rapidData, selfclose })=> {
  
  const handleRapid = (e)=> {
    this.dorapid.disabled = true;
    const rapId = rapidData._id;
    
    if(rapId) {
      Meteor.call('setRapidFork', seriesId, serial, rapId, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success(Pref.rapidExd);
          selfclose();
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      toast.error(`No ${Pref.rapidEx} ID`);
    }
  };
  
  return(
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
  );
};