import React, { useState } from 'react';
import { toast } from 'react-toastify';

const UsernameChange = (props)=> {
	
	const [ namepassState, namepassStateSet ] = useState( false );
	const [ choiceName, choiceNameSet ] = useState( false );

	function doChange(e) {
	  e.preventDefault();
	  
		Meteor.call('selfUsernameChange', namepassState, choiceName, (error, reply)=>{
			if(error) {
			  console.log(error);
			  toast.error( error.reason || 'Undefined' );
			}
			if(reply === true) {
				toast.success('Username changed corectly');
				this.namenowPassUser.value = '';
			}else if(reply) {
			  toast.error(reply.reason);
			}
		});
	}
	
	return(
		<div>
      <form 
        onSubmit={(e)=>doChange(e)}>
        
        <div className='bigInfoBox no'>
          <div><label htmlFor='namenowPassUser'>Current Password</label></div>
          <div>
            <input
              type='password'
              id='namenowPassUser'
              onChange={()=>namepassStateSet(namenowPassUser.value)}
              autoComplete="new-password" 
              required
            />
          </div>
        </div>
        
        <div className='bigInfoBox' 
          data-describe='Letters, numbers, uppercase, lowercase and the symbols . _ - are all acceptable; a minimum of 4 characters are required.'>
          <div><label htmlFor='newusername'>New Username</label></div>
          <div>
            <input
              type='text'
              id='newusername'
              className='showValid'
              minLength='4'
  	          pattern='[A-Za-z0-9\._-]*'
              onChange={()=>choiceNameSet(newusername.value)}
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
            className='action nSolid'
           >Save New Username</button>
        </p>
      </form>
    </div>
	);
};

export default UsernameChange;