import React from 'react';
//import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const TrackStepEdit = ({app, branchesSort, data})=> {
  
  const opKey = data.key;
  
  function editTrackOp(e) {
    e.preventDefault();
    
    let step = this[opKey + 'input'].value.trim();
    let type = this[opKey + 'type'].value.trim();
    let branch = this[opKey + 'branch'].value.trim();
    
    Meteor.call('editTrackStepOption', opKey, step, type, branch, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Server Error');
      }
    });
  }
  
  return (
    <form onSubmit={(e)=>editTrackOp(e)} className='inlineForm vmargin'>
      <label htmlFor={opKey + 'form'}><br />
        <input
          type='text'
          id={opKey + 'input'}
          defaultValue={data.step}
          required
        />
      </label>
      
      <label htmlFor={opKey + 'type'}><br />
        <select
          id={opKey + 'type'} 
          defaultValue={data.type} 
          className='tableAction' 
          required
        >
          <option value='first'>first</option>
          <option value='build'>build</option>
          <option value='inspect'>inspect</option>
          <option value='test'>test</option>
          <option value='checkpoint'>checkpoint</option>
          <option value='nest'>nest</option>
        </select>
      </label>

      <label htmlFor={opKey + 'branch'}><br />
        <select
          id={opKey + 'branch'}
          defaultValue={data.branchKey || null} 
          required >
          <option></option>
          {branchesSort.map( (entry, index)=>{
            return( 
              <option
                key={index+entry.brKey} 
                value={entry.brKey}
              >{entry.branch}</option>
          )})}
        </select>
      </label>
      
      <label htmlFor={opKey + 'edit'}><br />
        <button
          type='submit'
          id={opKey + 'edit'}
          className='smallAction clearGreen'
          disabled={false}
        >Set</button>
      </label>
    </form>
  );
};

export default TrackStepEdit;