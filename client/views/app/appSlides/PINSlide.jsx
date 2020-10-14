import React from 'react';
import { toast } from 'react-toastify';

const PINSlide = ()=> {
  
  function setPin(e) {
    e.preventDefault();
    const old = this.oldPin.value.trim();
    const newOne = this.newOne.value.trim();
    const newTwo = this.newTwo.value.trim();
    
    if(newOne === newTwo) {
      Meteor.call('setPin', old, newOne, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          toast.success('Saved');
          this.oldPin.value = '';
          this.newOne.value = '';
          this.newTwo.value = '';
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      toast.error('Server Error');
    }
  }
  
  function tellMeThePin() {
    const passCode = prompt('passcode', '');
    Meteor.call('revealPIN', passCode, (err, reply)=>{
      if(err)
        console.log(err);
      if(reply[0]) {
        alert(reply[1]);
      }else{
        console.log(reply[1]);
      }
    });
  }
  
  function setMinor(e) {
    e.preventDefault();
    const newOne = this.newOneM.value.trim();
    const newTwo = this.newTwoM.value.trim();
    
    if(newOne === newTwo) {
      Meteor.call('setMinorPin', newOne, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          toast.success('Saved');
          this.newOne.value = '';
          this.newTwo.value = '';
        }else{
          toast.error('Server Error');
        }
      });
    }else{
      toast.error('Server Error');
    }
  }
  
  return (
    <div className='space3v'>
      <h2>Set or Change PIN Numbers</h2>
      <p>A pin is necessary for activating new users and admins</p>
      <form onSubmit={(e)=>setPin(e)} autoComplete='off'>
        <p>
          <input
            type='password'
            id='oldPin'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='4'
            placeholder='0000-9999'
            inputMode='numeric'
            autoComplete='new-password'
          />
          <label htmlFor='old'>Old PIN</label>
        </p>
        <p>
          <input
            type='password'
            id='newOne'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='4'
            placeholder='0000-9999'
            inputMode='numeric'
            autoComplete='new-password'
            required
          />
          <label htmlFor='newOne'>New PIN</label>
          <br />
          <input
            type='password'
            id='newTwo'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='4'
            placeholder='0000-9999'
            inputMode='numeric'
            autoComplete='new-password'
            required
          />
          <label htmlFor='newTwo'>New PIN again</label>
        </p>
        <p>
          <button
            type='submit'
            className='smallAction clearGreen'
            disabled={false}
          >Save</button>
        </p>
      </form>
      <hr />
      <legend>Forgot PIN</legend>
      <button
        className='smallAction clearBlue'
        onClick={()=>tellMeThePin()}
      >Tell Me The Pin</button>
      <hr />
        <form onSubmit={(e)=>setMinor(e)} autoComplete='off'>
        <p>A minor pin for operations that are risky, or outside of regular permissions</p>
        <p>
          <input
            type='password'
            id='newOneM'
            pattern='[000-999]*'
            maxLength='3'
            minLength='3'
            placeholder='000-999'
            inputMode='numeric'
            autoComplete='000'
            required
          />
          <label htmlFor='newOne'>New PIN</label>
          <br />
          <input
            type='password'
            id='newTwoM'
            pattern='[000-999]*'
            maxLength='3'
            minLength='3'
            placeholder='000-999'
            inputMode='numeric'
            autoComplete='000'
            required
          />
          <label htmlFor='newTwo'>New PIN again</label>
        </p>
        <p>
          <button
            type='submit'
            className='smallAction clearGreen'
            disabled={false}
          >Save</button>
        </p>
      </form>
    </div>
  );
};

export default PINSlide;