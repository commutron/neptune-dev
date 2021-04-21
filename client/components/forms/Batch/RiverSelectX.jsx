import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const RiverSelect = ({ bID, wFlows, river, riverTitle, lock })=> {

  function handleChange(e) {
    let flow = this.riverchoice.value;
    flow === 'false' ? flow = false : null;
   
    Meteor.call('setRiverX', bID, flow, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
    });
  }
  
  const adaptSize = riverTitle.length < 5 ? '6ch' :
                    riverTitle.length * 0.7 + 6 + 'ch';
  
  return(
    <i><i className='fas fa-project-diagram fa-fw greenT'></i> {Pref.flow}:
      <select 
        id='riverchoice'
        className='interSelect'
        defaultValue={river}
        onChange={(e)=>handleChange(e)}
        style={{ maxWidth: adaptSize, minWidth: '5ch', width: '100%' }}
        disabled={lock}
        required>
      <option></option>
      {wFlows.map( (entry, index)=>{
        return(
         <option key={index} value={entry.flowKey}>{entry.title}</option>
         );
      })}
      </select>
    </i>
  );
};

export default RiverSelect;