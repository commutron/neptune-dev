import React from 'react';

import Tabs from '/client/components/smallUi/Tabs/Tabs';

import './style.css';
import ScanUI from './ScanUI';
import SignIn from './SignIn';
import NewUser from './NewUser';

const AccountsUI = ({ login, uID, username })=> {
	
	const crd = { 
		minHeight: '300px',
		width: '300px',
  	margin: '5vh 0 0 0'
	};
	
	const bttn = {
	  height: '32px',
	  minWidth: '100%',
	  width: '100%',
	  maxWidth: '100%',
	  marginTop: '0.75rem',
	  fontSize: 'medium',
	  fontWeight: '600',
	  color: 'rgb(20,20,20)',
	  textAlign: 'center',
	  letterSpacing: '1.5px',
	  cursor: 'pointer'
	};
	
	let mxW = { maxWidth: '240px' };
	let pad = { padding: '0 25px' };
		
	return(
		<div style={crd}>
		  
		  {login && uID && username ?
        <div>
        	<p className='medBig'>Signed in as: {username}</p>
        	<p>
        		<button
        			id='logout'
        			style={bttn}
        			className='userFormButtons loginoutButton'
        			onClick={()=>Meteor.logout()}
        		>Sign Out</button>
        	</p>
        </div>
      :
      	<Tabs
	        tabs={['scan in', 'sign in', 'sign up']}
        	names={true}
        	wide={true}>
        	
        	<ScanUI mxW={mxW} />
					
					<SignIn mxW={mxW} pad={pad} bttn={bttn} />
					
	        <NewUser mxW={mxW} pad={pad} bttn={bttn} />
	        
	      </Tabs>
		  }
    </div>
	);
};

export default AccountsUI;