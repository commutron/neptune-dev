import React, { useState } from 'react';
import { toast } from 'react-toastify';

const UsernameChange = (props)=> {
	
	const [ choiceName, choiceNameSet ] = useState( false );

	function doChange(e) {
	  e.preventDefault();
	  const check = window.confirm('Are you sure you want to change your Username?');

    if(check) {
  		Meteor.call('selfUsernameChange', choiceName, (error, reply)=>{
  			if(error) {
  			  toast.error('Could not change username');
  			  console.log(error);
  			}
  			if(reply) {
  				toast.success('Username changed corectly');
  				this.unPass.value = '';
  			}
  		});
    }
	}
	
	return(
		<div>
      <form 
        onSubmit={(e)=>doChange(e)}>
        <p>
          <label htmlFor='chPass'>New Username</label>
          <br />
          <input
            type='text'
            id='unPass'
            minLength='4'
	          pattern='[A-Za-z0-9\._-]*'
            onChange={()=>choiceNameSet(unPass.value)}
            placeholder={Meteor.user().username}
            required
            autoComplete="false" />
        </p>
        <p>
          <button
            type='submit'
            id='changeUsrNmSubmit'
            className='action clearGreen'
           >Save New Username</button>
        </p>
      </form>
    </div>
	);
};

export default UsernameChange;