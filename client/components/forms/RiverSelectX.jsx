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
  
  const adaptSize = riverTitle.length < 5 ? '5ch' :
                    riverTitle.length * 0.7 + 5 + 'ch';
  
  return(
    <i><i className='fas fa-project-diagram fa-fw greenT'></i> {Pref.flow}:
      <select 
        id='riverchoice'
        className='interSelect'
        defaultValue={river}
        onChange={(e)=>handleChange(e)}
        style={{ width: adaptSize }}
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