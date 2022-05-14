import React from 'react';
import { toast } from 'react-toastify';

const AppSetSimple = ({title, action, rndmKey})=> {
  
  function setApp(e) {
    e.preventDefault();
    const act = action;
    const newSet = this[rndmKey + 'input'].value.trim();
    
    const newVal = newSet.slice(0,4) === 'http' && newSet.slice(-1) === '/' ?
                   newSet.slice(0,-1) : newSet;

    if(act) {
      Meteor.call(act, newVal, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          this[rndmKey + 'input'].value = '';
        }else{
          toast.warning("server error");
        }
      });
    }else{
      toast.error('action not found');
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
            className='smallAction nHover'
            disabled={false}
          >Set</button>
        </label>
      </form>
    </div>
  );
};

export default AppSetSimple;