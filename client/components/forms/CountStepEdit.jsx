import React from 'react';
import { toast } from 'react-toastify';

const CountStepEdit = ({ app, branchesSort, data })=> {
  
  const opKey = data.key;
  
  function editCountOp(e) {
    e.preventDefault();
    
    let gate = this[opKey + 'input'].value.trim();
    let type = this[opKey + 'type'].value.trim();
    let branch = this[opKey + 'branch'].value.trim();
    
    Meteor.call('editCountOption', opKey, gate, type, branch, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Server Error');
      }
    });
  }
  
  return (
    <form onSubmit={(e)=>editCountOp(e)} className='inlineForm vmargin'>
      <label htmlFor={opKey + 'form'}><br />
        <input
          type='text'
          id={opKey + 'input'}
          defaultValue={data.gate}
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
          <option value='build'>build</option>
          <option value='inspect'>inspect</option>
          <option value='test'>test</option>
          <option value='checkpoint'>checkpoint</option>
          <option value='finish'>finish</option>
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
          className='smallAction clearBlue'
          disabled={false}
        >Set</button>
      </label>
    </form>
  );
};

export default CountStepEdit;