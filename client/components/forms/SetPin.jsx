import React from 'react';
import Alert from '/client/global/alert.js';

const SetPin = ()=> {
  
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
          Bert.alert(Alert.success);
          this.oldPin.value = '';
          this.newOne.value = '';
          this.newTwo.value = '';
        }else{
          Bert.alert(Alert.warning);
        }
      });
    }else{
      Bert.alert(Alert.danger);
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
  
  return (
    <div>
      <fieldset>
        <legend>Set or Change PIN</legend>
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
      </fieldset>
      <fieldset>
        <legend>Forgot PIN</legend>
        <button
          className='smallAction clearBlue'
          onClick={()=>tellMeThePin()}
        >Tell Me The Pin</button>
      </fieldset>
    </div>
  );
};

export default SetPin;