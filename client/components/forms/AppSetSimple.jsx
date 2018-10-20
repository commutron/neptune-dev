import React from 'react';
import Alert from '/client/global/alert.js';

const AppSetSimple = ({title, action, rndmKey})=> {
  
  function setApp(e) {
    e.preventDefault();
    const act = action;
    const newSet = this[rndmKey + 'input'].value.trim();
    
    if(act) {
      Meteor.call(act, newSet, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          this[rndmKey + 'input'].value = '';
        }else{
          Bert.alert(Alert.warning);
        }
      });
    }else{
      alert('action not found');
    }
  }
    
  return(
    <div>
      <form id={rndmKey + 'form'} onSubmit={(e)=>setApp(e)} className='inlineForm'>
        <label htmlFor={rndmKey + 'input'}>{title}<br />
          <input
            type='text'
            id={rndmKey + 'input'}
            required
          />
        </label>
        <label htmlFor={rndmKey + 'go'}><br />
          <button
            type='submit'
            id={rndmKey + 'go'}
            className='smallAction clearGreen'
            disabled={false}
          >Set</button>
        </label>
      </form>
    </div>
  );
};

export default AppSetSimple;

