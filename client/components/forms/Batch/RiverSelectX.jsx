import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const RiverSelect = ({ bID, wFlows, river, riverTitle, lock, access })=> {

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
  
  const aT = !access ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = access && !lock ? `Set ${Pref.flow}` : `${aT}\n${lT}`;
  
  const adaptSize = riverTitle.length < 5 ? '6ch' :
                    riverTitle.length * 0.7 + 6 + 'ch';
  
  return(
    <i><i className='fas fa-project-diagram fa-fw blueT'></i> {Pref.flow}:
      <select 
        id='riverchoice'
        title={title}
        className='interSelect'
        defaultValue={river}
        onChange={(e)=>handleChange(e)}
        style={{ maxWidth: adaptSize, minWidth: '5ch', width: '100%' }}
        disabled={!access || lock}
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