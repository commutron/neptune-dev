import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { toast } from 'react-toastify';


const NewUser = ({ sty })=> {
  
  const [ newUsernameState, newUsernameSet ] = useState( false );
	const [ choicePasswordState, choicePasswordSet ] = useState( false );
	const [ confirmPasswordState, confirmPasswordSet ] = useState( false );
	const [ organizationNameState, organizationNameSet ] = useState( false );
	const [ orgPinState, orgPinSet ] = useState( false );
  
  const [ newUserResultState, newUserResultSet ] = useState( '' );

	function doNew(e) {
	  e.preventDefault();
	  const user = newUsernameState;
	  const passChoice = choicePasswordState;
	  const passConfirm = confirmPasswordState;
	  const orgName = organizationNameState;
	  const orgPIN = orgPinState;
	  
	  if(passChoice === passConfirm) {
	    Meteor.call('verifyOrgJoin', orgName, orgPIN, (error, reply)=>{
	      if(error)
	        console.log(error);
	      if(reply === true) {
	      	newUserResultSet( "" );
	      	let options = {username: user, password: passChoice, org: orgName};
	      	Accounts.createUser(options, (error)=>{
	      		if(error) {
	      			console.log(error);
	      			toast.error('the server says no');
	      			newUserResultSet( error.reason );
	      		}else{
	      			toast.success('Everything worked corectly');
	      		}
	      	});
		    }else{
		    	toast.error('the server says no');
		    	newUserResultSet( "Can't find an organization with that PIN" );
		    }
	    });
	  }else{
	    toast.warning("the client says no match");
	    newUserResultSet( "the password fields don't match, try typing them in again" );
	  }
	}
	
	
	return(
    <form 
      onSubmit={(e)=>doNew(e)}
      autoComplete="off">
      <input type='hidden' value='autocompleteFix' autoComplete='off' />
      <p>
        <label htmlFor='newUsername'>Username</label>
        <br />
        <input
          type='text'
          id='newUsername'
          className='showValid'
          onChange={()=>newUsernameSet( newUsername.value )}
          placeholder='username'
          required
          minLength='4'
          pattern='[A-Za-z0-9\._-]*'
          autoComplete="off" />
      </p>
      <p>
        <label htmlFor='choicePassword'>New Password</label>
        <br />
        <input
          type='password'
          id='choicePassword'
          className='showValid'
          onChange={()=>choicePasswordSet( choicePassword.value )}
          placeholder='password'
          pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
          minLength='6'
          autoComplete="new-password"
          required />
      </p>
      <p>
        <label htmlFor='confirmPassword'>New Password Again</label>
        <br />
        <input
          type='password'
          id='confirmPassword'
          className='showValid'
          onChange={()=>confirmPasswordSet( confirmPassword.value )}
          placeholder='password'
          pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
          autoComplete="new-password"
          required />
      </p>
      <p>
        <label htmlFor='organizationName'>Organization</label>
        <br />
        <input
          type='text' 
          id='organizationName'
          onChange={()=>organizationNameSet( organizationName.value )}
          placeholder='Organization'
          autoComplete='organization'
          required />
      </p>
      <p>
        <label htmlFor='orgPin'>Activation PIN</label>
        <br />
        <input
          type='password'
          id='orgPin'
          onChange={()=>orgPinSet( orgPin.value )}
          pattern='[0000-9999]*'
          maxLength='4'
          minLength='4'
          cols='4'
          placeholder='PIN'
          inputMode='numeric'
          autoComplete="new-password"
          required />
      </p>
      <p>
        <button
          type='submit'
          id='createSubmit'
          className='userFormButtons createButton'
         >Create New User</button>
      </p>
      <p style={sty}>{newUserResultState}</p>
    </form>
  );
};

export default NewUser;