import React, { useState, useEffect } from 'react';
// import { Accounts } from 'meteor/accounts-base';
// import { toast } from 'react-toastify';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';

import { SigninListenerUtility, SigninListenerOff } from '/client/utility/SigninListener';

import './style.css';
// import ScanUI from './ScanUI';
import NewUser from './NewUser';

const AccountsUI = ({ login, uID, username })=> {
	
	const [ loginState, loginSet ] = useState( false );

	useEffect( ()=> {
    SigninListenerUtility(loginSet);
    return ()=>{ SigninListenerOff() };
  }, []);
  
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

		
	let sty = { maxWidth: '240px' };
		
	return(
		<div className='loginCard'>
		  
		  {login && uID && username ?
        <div>
        	<p className='medBig'>Signed in as: {username}</p>
        	<p>
        		<button
        			id='logout'
        			className='userFormButtons loginoutButton'
        			onClick={()=>Meteor.logout()}
        		>Sign Out</button>
        	</p>
        </div>
      :
      	<Tabs
	        tabs={['Sign In', 'New User']}
        	names={true}
        	wide={true}>
        	
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
	          <p style={sty}>{loginResultState}</p>
	        </form>
 
	        <NewUser sty={sty} />
	        
	      </Tabs>
		  }
    </div>
	);
};

export default AccountsUI;