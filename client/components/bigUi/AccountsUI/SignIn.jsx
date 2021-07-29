import React, { useState } from 'react';

import './style.css';

const SignIn = ({ sty })=> {
  
	const [ loginUsernameState, loginUsernameSet ] = useState( false );
	const [ loginPasswordState, loginPasswordSet ] = useState( false );
	
	const [ loginResultState, loginResultSet ] = useState( '' );
	
	function doLogin(e) {
	  e.preventDefault();
	  const user = loginUsernameState;
	  const pass = loginPasswordState;
		const redirect = Session.get('redirectAfterLogin');
	  
	  Meteor.loginWithPassword(user, pass, (error)=>{
	    if(error) {
	      console.log(error);
	      loginResultSet( error.reason );
	    }else{
	    	Meteor.logoutOtherClients();
	    }
	    if(!redirect || redirect === '/login') {
	    	!error && loginResultSet( '' );
	    }
	  });
	}
	
		
	return(
		<form 
      onSubmit={(e)=>doLogin(e)}>
      <input 
      	type='hidden' 
      	value='autocompleteFix' 
      	autoComplete="new-password" />
      <p>
        <label htmlFor='loginUsername'>Username</label>
        <br />
        <input
          type='text'
          id='loginUsername'
          onChange={()=>loginUsernameSet(loginUsername.value)}
          required />
      </p>
      <p>
        <label htmlFor='loginPassword'>Password</label>
        <br />
        <input
          type='password' 
          id='loginPassword'
          onChange={()=>loginPasswordSet( loginPassword.value )}
          autoComplete="off"
          required />
      </p>
      <p>
        <button
          type='submit'
          id='loginSubmit'
          className='userFormButtons loginoutButton'
         >Sign In</button>
      </p>
      <p style={sty} className='centreText'>{loginResultState}</p>
    </form>
	);
};

export default SignIn;