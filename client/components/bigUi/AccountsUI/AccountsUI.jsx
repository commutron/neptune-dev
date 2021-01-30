import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { toast } from 'react-toastify';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import './style.css';

const AccountsUI = ({ login, uID, username })=> {
	
	const [ loginUsernameState, loginUsernameSet ] = useState( false );
	const [ loginPasswordState, loginPasswordSet ] = useState( false );
	const [ newUsernameState, newUsernameSet ] = useState( false );
	const [ choicePasswordState, choicePasswordSet ] = useState( false );
	const [ confirmPasswordState, confirmPasswordSet ] = useState( false );
	const [ organizationNameState, organizationNameSet ] = useState( false );
	const [ orgPinState, orgPinSet ] = useState( false );
	const [ loginResultState, loginResultSet ] = useState( '' );
	const [ newUserResultState, newUserResultSet ] = useState( '' );
	
	function doLogout() {
		if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
	  	const sessionID = Meteor.connection._lastSessionId;
	  	const agent = window.navigator.userAgent;
			Meteor.call('logLogInOut', false, agent, sessionID);
	  }
		Meteor.logout();//()=>{	});
	}
	
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
        			onClick={(e)=>doLogout(e)}
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
	          <input type='hidden' value='autocompleteFix' autoComplete="new-password" />
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
	              onChange={()=>newUsernameSet( newUsername.value )}
	              placeholder='username'
	              required
	              minLength='4'
	              pattern='[A-Za-z0-9 \._-]*'
	              autoComplete="off" />
	          </p>
	          <p>
	            <label htmlFor='choicePassword'>New Password</label>
	            <br />
	            <input
	              type='password'
	              id='choicePassword'
	              onChange={()=>choicePasswordSet( choicePassword.value )}
	              placeholder='password'
	              autoComplete="new-password"
	              required />
	          </p>
	          <p>
	            <label htmlFor='confirmPassword'>New Password Again</label>
	            <br />
	            <input
	              type='password'
	              id='confirmPassword'
	              onChange={()=>confirmPasswordSet( confirmPassword.value )}
	              placeholder='password'
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
	      </Tabs>
		  }
    </div>
	);
};

export default AccountsUI;