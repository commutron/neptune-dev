import React from 'react';
import { Meteor } from 'meteor/meteor';

const ActivateUser = ()=>	{

  function activate(e) {
    e.preventDefault();
    this.go.disabled = true;
    const pIn = this.pIn.value.trim();
    const org = this.org.value.trim();
    Meteor.call('activate', pIn, org, (err, reply)=>{
      if(err)
        console.log(err);
      if(reply) {
        FlowRouter.go('home');
      }else{
        alert('Incorrect PIN');
      }
    });
  }
    
  return(
    <div className='centre'> 
      <form onSubmit={(e)=>activate(e)} autoComplete='off'>
      <input type='hidden' />
        <p>
          <label htmlFor='pIn'>Activate New User</label>
        </p>
        <p>
          <input
            type='text'
            //ref={(i)=> this.org = i}
            id='org'
            placeholder='Organization Name'
            required
          />
          <input
            type='password'
            //ref={(i)=> this.pIn = i}
            id='pIn'
            pattern='[0000-9999]*'
            maxLength='4'
            minLength='4'
            cols='4'
            placeholder='Admin PIN'
            inputMode='numeric'
            autoComplete='new-password'
            required
          />
          <button
            type='submit'
            //ref={(i)=> this.go = i}
            id='go'
            className='smallAction clearWhite'
            disabled={false}
          >Join</button>
        </p>
      </form>
      <br />
    </div>
  );
};


export default ActivateUser;