import React from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const HomeIcon = () => {
  
  function doLogout() {
    if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
  		Meteor.call('logLog', false, ()=>{
  			Meteor.logout();
  		});
    }else{
      Meteor.logout();
    }
	}
	
  //console.log(Meteor.status());
  const user = Meteor.user() ? 'Signed in as: ' + Meteor.user().username : '';
  return(
    <div className='homeIcon'>
      <ContextMenuTrigger
				id='absoluteHome01'>
							
      <a className='homeIconLink' href='/' title='Home'>
        <img
          src='/neptune-logo-white.svg'
          className='homeIconLogo' />
      </a>
      
      </ContextMenuTrigger>
      <ContextMenu id='absoluteHome01'>
        <MenuItem disabled={true}>
          <i>{'Neptune v.' + Pref.neptuneVersion}</i>
        </MenuItem>
        <MenuItem onClick={()=>FlowRouter.go('/production')}>
          <i className='fas fa-paper-plane fa-fw'></i><i className='noCopy'> Production</i>
        </MenuItem>
        <MenuItem onClick={()=>FlowRouter.go('/overview')}>
          <i className='fab fa-fly fa-fw'></i><i className='noCopy'> Overview</i>
        </MenuItem>
        <MenuItem onClick={()=>FlowRouter.go('/activity')}>
          <i className='fab fa-wpexplorer fa-fw' data-fa-transform='flip-h'></i><i className='noCopy'> Activity</i>
        </MenuItem>
        <MenuItem onClick={()=>FlowRouter.go('/data')}>
          <i className='fas fa-rocket fa-fw'></i><i className='noCopy'> Explore</i>
        </MenuItem>
        {/*<MenuItem onClick={()=>FlowRouter.go('/starfish')}>
          <i className='fas fa-microchip fa-fw'></i><i className='noCopy'> Parts Search</i>
        </MenuItem>*/}
        {Roles.userIsInRole(Meteor.userId(), 'admin') ?
          <MenuItem onClick={()=>FlowRouter.go('/app')}>
            <i className='fas fa-sliders-h fa-fw'></i><i className='noCopy'> Settings</i>
          </MenuItem>
        : null}
        <MenuItem disabled={true}>
          <i>{user}</i>
        </MenuItem>
        <MenuItem onClick={()=>doLogout()}>
          <i className='fas fa-sign-out-alt fa-fw'></i><i className='noCopy'> Sign-out</i>
        </MenuItem>
      </ContextMenu>
      
    </div>
  );
};

export default HomeIcon;










