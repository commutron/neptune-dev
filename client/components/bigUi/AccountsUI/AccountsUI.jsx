import React from 'react';

import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';

import './style.css';
import ScanUI from './ScanUI';
import SignIn from './SignIn';
import NewUser from './NewUser';

const AccountsUI = ({ login, uID, username })=> {

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
	        tabs={['scan in', 'sign in', 'sign up']}
        	names={true}
        	wide={true}>
        	
        	<ScanUI />
					
					<SignIn sty={sty} />
					
	        <NewUser sty={sty} />
	        
	      </Tabs>
		  }
    </div>
	);
};

export default AccountsUI;