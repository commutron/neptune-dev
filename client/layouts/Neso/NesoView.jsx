import React, { Fragment }from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toast, ToastContainer } from 'react-toastify';
// import moment from 'moment';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';

import { SpinWrap } from '/client/components/tinyUi/Spin';
import SignIn from '/client/components/bigUi/AccountsUI/SignIn';
import NesoInbox from '/client/views/neso/NesoInbox';
import NesoEquip from '/client/views/neso/NesoEquip';

const NesoView = ({ 
  view, login, user, 
  username, users, equipData
})=> {
	
	if(Meteor.loggingIn()) {
    return(
      <SpinWrap color={true} />
    );
  }
	
  if(!login) {
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
	
	  return(
	    <div className='nesoMain darkTheme'>
	    	<TopBar />
	      <div className='nesoCenter thinScroll'>
	        <div id='nesignin' className='nesoFloat'>
	          <SignIn mxW={mxW} pad={pad} bttn={bttn} />
	         </div>
	        <BotBar />
	      </div>
	      <NavBar view="signin" />
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
  			  {view === 'inbox' ?
  			    <NesoInbox 
    			    user={user} 
    			    unice={unice} 
    			    users={users} 
    			  />
    			  :
  			    view === 'equip' ?
      			  <NesoEquip
      			    user={user} 
      			    unice={unice} 
      			    equipData={equipData} 
      			  />
      		: 
      		  <div id="nehome">
              <i className='texttitle subtext'>Neso</i>
		          <a className='foottext textclick' href='/ne/inbox'>'Neso Inbox'</a>
		          <a className='foottext textclick' href='/ne/equip'>'Neso Equipment'</a>
            </div>   
  			  }
    			<BotBar unice={unice} />
    		</div>
  			
  			<NavBar view={view} />
  		</div>
  	</Fragment>
  );
};

export default withTracker( ({ view }) => {
  let login = Meteor.userId() ? true : false;
  let uID = Meteor.userId() || false;
  let user = login ? Meteor.user() : false;
  let username = user ? user.username : false;
  
  view === 'equip' ? Meteor.subscribe('thinEquip') : [];
  
  // console.log({view});
  return {
  	login: login,
  	uID: uID,
    user: user,
    username: username,
    users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
    equipData: EquipDB.find( {}, { sort: { alias: -1 } } ).fetch(),
    // maintainData: MaintainDB.find( {}, { sort: { name: -1 } } ).fetch(),
    view: view
  };
})(NesoView);

const TopBar = ()=> (
	<div className='nesoHead textbar noCopy'>
		<i className='headtext texttitle'>
		  <a href='/ne' style={{color:'var(--cloudstrans)'}}>
		    <i className="fa-regular fa-circle-dot gapR nT fadeMore"></i>Ne
		  </a>
		</i>
		<span className='flexSpace' />
	</div>
);

const NavBar = ({ view })=> {
  if(view === 'signin') {
    return(
      <div className='nesoNav textbar noCopy'>
    	  <FakeLink name='Sign In' view={view} linkid='#nesignin' /> 
    	  <FakeLink name='Links' view={view} linkid='#nelinks' /> 
    	</div>
    );
  }
  if(view === 'inbox') {
    return(
    	<div className='nesoNav textbar noCopy'>
    	  <FakeLink name='Send' view={view} linkid='#nesend' /> 
    	  <FakeLink name='Inbox' view={view} linkid='#neinbox' /> 
    	  <FakeLink name='Links' view={view} linkid='#nelinks' /> 
    	</div>
    );
  }
  if(view === 'equip') {
    return(
    	<div className='nesoNav textbar noCopy'>
    	  <FakeLink name='Equipment' view={view} linkid='#neeqlist' /> 
    	  <FakeLink name='Links' view={view} linkid='#nelinks' /> 
    	</div>
    );
  }
  return(
  	<div className='nesoNav textbar noCopy'>
  	  <FakeLink name='Neso' view='' linkid='#nehome' /> 
  	  <FakeLink name='Links' view='' linkid='#nelinks' /> 
  	</div>
  );
};
const FakeLink = ({ name, view, linkid })=> (
  <button 
    className='foottext textclick navclick'
    onClick={()=>window.location.href='/ne'+(view ? '/' : '')+view+linkid}
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