import React, { useState } from 'react';

import './style.css';

const SignIn = ({ mxW, pad, bttn })=> {
  
	const [ loginUsernameState, loginUsernameSet ] = useState( false );
	const [ loginPasswordState, loginPasswordSet ] = useState( false );
	
	const [ loginResultState, loginResultSet ] = useState( '' );
	
	function doLogin(e) {
	  e.preventDefault();
	  this.loginSubmit.disabled = true;
	  
	  const user = loginUsernameState;
	  const pass = loginPasswordState;
		const redirect = Session.get('redirectAfterLogin');
	  
	  Meteor.loginWithPassword(user, pass, (error)=>{
	    if(error) {
	      console.log(error);
	      loginResultSet( error.reason );
	      this.loginSubmit.disabled = true;
	    }else{
	    	Meteor.logoutOtherClients();
	    }
	    if(!redirect || redirect === '/login') {
	    	!error && loginResultSet( '' );
	    }
	  });
	}
		
	return(
		<form style={pad} onSubmit={(e)=>doLogin(e)}>
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
          style={{ width: '100%' }}
          onChange={()=>loginUsernameSet(loginUsername.value)}
          required />
      </p>
      <p>
        <label htmlFor='loginPassword'>Password</label>
        <br />
        <input
          type='password' 
          id='loginPassword'
          style={{ width: '100%' }}
          onChange={()=>loginPasswordSet( loginPassword.value )}
          autoComplete="off"
          required />
      </p>
      <p>
        <button
          type='submit'
          id='loginSubmit'
          style={bttn}
          className='action nSolid blackT'
         >Sign In</button>
      </p>
      <p style={mxW} className='centreText'>{loginResultState}</p>
    </form>
	);
};

export default SignIn;