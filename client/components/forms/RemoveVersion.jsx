import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium.jsx';
// requires
// widgetData={widgetData} end={a.lastTrack} rootWI={a.instruct}

const RemoveVersionWrapper = ({ widgetId, versionKey, check })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
  
  return(
    <ModelMedium
      button='Delete'
      title={`delete "${Pref.version}" permanently`}
      color='redT'
      icon='fa-minus-circle'
      lock={!auth}
    >
      <RemoveVersion
        widgetId={widgetId}
        versionKey={versionKey}
        check={check}
      />
    </ModelMedium>
  );   
};

export default RemoveVersionWrapper;


const RemoveVersion = ({ widgetId, versionKey, check })=> {
  
  function handleRemove(e) {
    e.preventDefault();
    const wId = widgetId;
    const vKey = versionKey;
    const confirm = this.confirmVal.value.trim();
    
    Meteor.call('deleteVersion', wId, vKey, confirm, (error, reply)=>{
      error && console.log(error);
      if(reply === 'inUse') {
        toast.warning('Cannot be removed, entry is in use');
      }else if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Rejected by Server');
      }
    });
  }
  
  let checkshort = check.split('T')[0];
    
  return(
    <div className='centre'>
      <p>To remove enter:</p>
      <p className='noCopy clean numFont'>{checkshort}</p>
      <br />
      <form className='inlineForm' onSubmit={(e)=>handleRemove(e)}>
        <input 
          type='text' 
          className='noCopy' 
          id='confirmVal'
          placeholder={checkshort}
          required />
        <button
          type='submit'
          id='cut'
          className='smallAction clear redT'
        >Delete</button>
      </form>
    </div>
  );
};