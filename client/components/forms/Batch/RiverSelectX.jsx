import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const RiverSelect = ({ bID, wFlows, river, riverTitle, lock, access })=> {

  function handleChange(e) {
    let flow = e.target.value;
    flow === 'false' ? flow = false : null;
   
    Meteor.call('setRiverX', bID, flow, (error)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
    });
  }
  
  const aT = !access ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = access && !lock ? `Set ${Pref.flow}` : `${aT}\n${lT}`;
  
  const adaptSize = riverTitle.length < 5 ? '8ch' :
                    riverTitle.length * 0.6 + 8 + 'ch';
  
  return(
    <i><i className='fa-solid fa-project-diagram fa-fw gapR blueT'></i>{Pref.flow}:
      <select 
        id='riverchoice'
        title={title}
        className='interSelect'
        defaultValue={river}
        onChange={(e)=>handleChange(e)}
        style={{ maxWidth: adaptSize, minWidth: '8ch', width: '100%' }}
        disabled={!access || lock}
        required>
      <option></option>
      {wFlows.map( (entry, index)=>(
         <option key={index} value={entry.flowKey}>{entry.title}</option>
      ))}
      </select>
    </i>
  );
};

export default RiverSelect;