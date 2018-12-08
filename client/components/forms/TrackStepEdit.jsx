import React from 'react';
//import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const TrackStepEdit = ({data})=> {
  
  const opKey = data.key;
  
  function editTrackOp(e) {
    e.preventDefault();
    
    let step = this[opKey + 'input'].value.trim();
    let type = this[opKey + 'type'].value.trim();
    let phase = this[opKey + 'phase'].value.trim();
    
    Meteor.call('editTrackStepOption', opKey, step, type, phase, (error, reply)=>{
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
          <select id={opKey + 'type'} defaultValue={data.type} required >
            <option value='first'>first</option>
            <option value='build'>build</option>
            <option value='inspect'>inspect</option>
            <option value='test'>test</option>
            <option value='checkpoint'>checkpoint</option>
            <option value='nest'>nest</option>
          </select>
        </label>
        <label htmlFor={opKey + 'type'}><br />
          <select id={opKey + 'phase'} defaultValue={data.phase || null} required >
            <option></option>
            <option value='surface mount'>Surface Mount</option>
            <option value='through hole'>Through Hole</option>
            <option value='selective solder'>Selective Solder</option>
            <option value='wave solder'>Wave Solder</option>
            <option value='testing'>Testing</option>
            <option value='conformal coat'>Conformal Coat</option>
            <option value='shipping'>Shipping</option>
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