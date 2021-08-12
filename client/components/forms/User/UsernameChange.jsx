import React, { useState } from 'react';
import { toast } from 'react-toastify';

const UsernameChange = (props)=> {
	
	const [ passState, passStateSet ] = useState( false );
	const [ choiceName, choiceNameSet ] = useState( false );

	function doChange(e) {
	  e.preventDefault();
	  
		Meteor.call('selfUsernameChange', passState, choiceName, (error, reply)=>{
			if(error) {
			  console.log(error);
			  toast.error( error.reason || 'Undefined' );
			}
			if(reply === true) {
				toast.success('Username changed corectly');
				this.unPass.value = '';
			}else if(reply) {
			  toast.error(reply.reason);
			}
		});
	}
	
	return(
		<div>
      <form 
        onSubmit={(e)=>doChange(e)}>
        
        <div className='bigInfoBox' 
          data-describe='If you have forgotten your current password, contact an administrator.'>
          <div><label htmlFor='nowPassUser'>Current Password</label></div>
          <div>
            <input
              type='password'
              id='nowPassUser'
              onChange={()=>passStateSet(nowPassUser.value)}
              autoComplete="new-password" 
              required
            />
          </div>
        </div>
        
        <div className='bigInfoBox' 
          data-describe='Letters, numbers, uppercase, lowercase and the symbols . _ - are all acceptable; a minimum of 4 characters are required.'>
          <div><label htmlFor='chPass'>New Username</label></div>
          <div>
            <input
              type='text'
              id='unPass'
              className='showValid'
              minLength='4'
  	          pattern='[A-Za-z0-9\._-]*'
              onChange={()=>choiceNameSet(unPass.value)}
              placeholder={Meteor.user().username}
              required
              autoComplete="false" 
            />
          </div>
        </div>
        
        <p className='rightRow'>
          <button
            type='submit'
            id='changeUsrNmSubmit'
            className='action clearBlue'
           >Save New Username</button>
        </p>
      </form>
    </div>
	);
};

export default UsernameChange;