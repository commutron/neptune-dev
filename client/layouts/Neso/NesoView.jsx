import React, { Fragment }from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toast, ToastContainer } from 'react-toastify';
// import moment from 'moment';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';

import { SpinWrap } from '/client/components/tinyUi/Spin';
import SignIn from '/client/components/bigUi/AccountsUI/SignIn';
import NesoInbox from '/client/views/neso/NesoInbox';


const NesoView = ({ login, user, username, users })=> {
	
	if(Meteor.loggingIn()) {
    return(
      <SpinWrap color={true} />
    );
  }
  
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
	
	let mxW = { maxWidth: '300px' };
	let pad = { padding: '0 25px' };
	
  if(!login) {
	  return(
	    <div className='nesoMain darkTheme'>
	    	<TopBar />
	      <div className='nesoCenter thinScroll'>
	        <div id='nesignin' className='nesoFloat'>
	          <SignIn mxW={mxW} pad={pad} bttn={bttn} />
	         </div>
	        <BotBar />
	      </div>
	      <NavBar />
	    </div>
  	);
  }
  
  if(!user || !users) {
    return(
      <SpinWrap color={true} />
    );
  }
    
  document.querySelector(':root').style
    .setProperty('--neptuneColor', user.customColor || null);
  
  if(!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  }else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
    
	const unice = toCap(username.replace(Pref.usrCut, " "), true);
  
	return(
	  <Fragment>
			<ToastContainer
        position="top-right"
        theme='colored'
        newestOnTop
        pauseOnVisibilityChange
        pauseOnHover
      />
      <div className='nesoMain darkTheme'> 
  			<TopBar />
  			
  			<div className='nesoCenter thinScroll'>
  			  <NesoInbox 
  			    user={user} 
  			    unice={unice} 
  			    users={users} 
  			  />

    			<BotBar unice={unice} />
    		</div>
  			
  			<NavBar user={true} />
  		</div>
  	</Fragment>
  );
};

export default withTracker( ({ query }) => {
  let login = Meteor.userId() ? true : false;
  let uID = Meteor.userId() || false;
  let user = login ? Meteor.user() : false;
  let username = user ? user.username : false;
  // console.log({query});
  return {
  	login: login,
  	uID: uID,
    user: user,
    username: username,
    users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
  };
})(NesoView);

const TopBar = ()=> (
	<div className='nesoHead textbar noCopy'>
		<i className='headtext texttitle'><i className="fa-regular fa-circle-dot gapR nT fadeMore"></i>Ne</i>
		<span className='flexSpace' />
	</div>
);

const NavBar = ({ user })=> {
  if(user) {
    return(
    	<div className='nesoNav textbar noCopy'>
    	  <FakeLink name='Send' linkid='#nesend' /> 
    	  <FakeLink name='Inbox' linkid='#neinbox' /> 
    	  <FakeLink name='Links' linkid='#nelinks' /> 
    	</div>
    );
  }
  return(
  	<div className='nesoNav textbar noCopy'>
  	  <FakeLink name='Sign In' linkid='#nesignin' /> 
  	  <FakeLink name='Links' linkid='#nelinks' /> 
  	</div>
  );
};
const FakeLink = ({ name, linkid })=> (
  <button 
    className='foottext textclick navclick'
    onClick={()=>window.location.href='?cntx=inbox'+linkid}
    type="button"
  >{name}</button>
);

const BotBar = ({unice})=> (
	<div id="nelinks" className='nesoFoot textbar noCopy'>
		<i className='nT fadeMore foottext texttitle'>|</i>
		<a className='foottext textclick' href='/'>Home</a>
		<i className='nT fadeMore foottext texttitle'>|</i>
		<a className='foottext textclick' href='/user'>{unice || 'Account'}</a>
		<i className='nT fadeMore foottext texttitle'>|</i>
		<button className='foottext textclick' onClick={()=>Meteor.logout()}>Sign-Out</button>
		<i className='nT fadeMore foottext texttitle'>|</i>
	</div>
);