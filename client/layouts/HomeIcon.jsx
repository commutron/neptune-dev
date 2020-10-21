import React from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const HomeIcon = () => {
	
	function doLogout() {
	  const tideOut = !Meteor.user().engaged ? true : 
	    confirm(`You are currently ${Pref.engaged} with a ${Pref.batch}`);
		if(tideOut) {
		  if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
    	  const sessionID = Meteor.connection._lastSessionId;
    	  const agent = window.navigator.userAgent;
      	Meteor.call('logLogInOut', false, agent, sessionID);
  	  }
		  Meteor.logout();
	  }
	}

	const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
	
  const user = Meteor.user() ? Meteor.user().username : '';
  
  const warningLight = isDebug ? 'debugWarningLight' : '';
  
  return(
    <div className={'homeIcon '}>
      <ContextMenuTrigger
				id='absoluteHome01'>
							
      <a className={'homeIconLink ' + warningLight} href='/' title='Home'>
        <img
          src='/neptune-logo-white.svg'
          className='homeIconLogo' />
      </a>
      
      </ContextMenuTrigger>
      <ContextMenu id='absoluteHome01' className='medBig'>
        <MenuItem disabled={true}>
          <i>{'Neptune v.' + Pref.neptuneVersion}</i><br />
          
          {isDebug ? <small>{Meteor.release}<br /></small> : null}
          
          <i>Status: {Meteor.status().status}</i>
        </MenuItem>
        {Meteor.userId() ? <React.Fragment>
        <MenuItem onClick={()=>FlowRouter.go('/production')}
          disabled={Roles.userIsInRole(Meteor.userId(), 'readOnly')}>
          <i className='fas fa-paper-plane fa-fw'></i><i className='noCopy'> Production</i>
        </MenuItem>
        
        <MenuItem onClick={()=>FlowRouter.go('/overview')}>
          <i className='fas fa-globe fa-fw'></i><i className='noCopy'> Overview</i>
        </MenuItem>
        
        {Roles.userIsInRole(Meteor.userId(), 'nightly') ?
          <MenuItem onClick={()=>FlowRouter.go('/upstream')}>
            <i className='fas fa-satellite-dish fa-fw'></i><i className='noCopy cap'> upstream</i>
          </MenuItem>
            :
            <MenuItem onClick={()=>FlowRouter.go('/upstream')}>
            <i className='fas fa-warehouse fa-fw'></i><i className='noCopy cap'> {Pref.upstream}</i>
          </MenuItem>
          }
          
        {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
          <MenuItem onClick={()=>FlowRouter.go('/downstream')}>
            <i className='fas fa-satellite fa-fw'></i><i className='noCopy cap'> {Pref.downstream}</i>
          </MenuItem>}
        
        <MenuItem onClick={()=>FlowRouter.go('/people')}>
          <i className='fas fa-user-astronaut fa-fw'></i><i className='noCopy'> People</i>
        </MenuItem>
        <MenuItem onClick={()=>FlowRouter.go('/data')}>
          <i className='fas fa-rocket fa-fw'></i><i className='noCopy'> Explore</i>
        </MenuItem>
        
        {Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <MenuItem onClick={()=>FlowRouter.go('/app')}>
            <i className='fas fa-sliders-h fa-fw'></i><i className='noCopy'> Settings</i>
          </MenuItem>
        : null}
        <MenuItem disabled={true}>
          <i>User: {user}</i>
        </MenuItem>
          <MenuItem onClick={()=>FlowRouter.go('/user')}>
            <i className='fas fa-user-astronaut fa-flip-horizontal fa-fw'></i><i className='noCopy'> Account</i>
          </MenuItem>
        <MenuItem onClick={()=>doLogout()}>
          <i className='fas fa-sign-out-alt fa-fw'></i><i className='noCopy'> Sign-out</i>
        </MenuItem>
        </React.Fragment> : null}
      </ContextMenu>
      
    </div>
  );
};

export default HomeIcon;










