import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { ToastContainer } from 'react-toastify';

const HomeIcon = () => {

	const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
	
  const warningLight = isDebug ? 'debugWarningLight' : '';
  
  return(
    <div className={'homeIcon '}>
      <ContextMenuTrigger
				id='absoluteHome01'>
							
      <a className={'homeIconLink ' + warningLight} href='/' title='Home'></a>
      
      </ContextMenuTrigger>
      <ContextMenu id='absoluteHome01' className='vbig'>
        <MenuItem disabled={true}>
          <i>{'Neptune v.' + Pref.neptuneVersion}</i><br />
          
          {isDebug ? <small>{Meteor.release}<br /></small> : null}
          
          <i>Status: {Meteor.status().status}</i>
        </MenuItem>
        <MenuItem divider />
        {Meteor.userId() ? 
          <Fragment>
            <MenuItem onClick={()=>FlowRouter.go('/production')}
              disabled={Roles.userIsInRole(Meteor.userId(), 'readOnly')}>
              <i className='far fa-paper-plane fa-fw'></i>
              <i className='noCopy'> Production</i>
            </MenuItem>
            
            <MenuItem onClick={()=>FlowRouter.go('/equipment')}>
              <i className='fa-solid fa-robot fa-fw'></i>
              <i className='noCopy cap'> {Pref.equip}</i>
            </MenuItem>
            
            <MenuItem onClick={()=>FlowRouter.go('/people')}>
              <i className='fas fa-user-astronaut fa-fw'></i>
              <i className='noCopy'> People</i>
            </MenuItem>
            
            <MenuItem onClick={()=>FlowRouter.go('/data')}>
              <i className='fas fa-rocket fa-fw'></i>
              <i className='noCopy'> Explore</i>
            </MenuItem>
            
            <MenuItem divider />
            
            <MenuItem onClick={()=>FlowRouter.go('/upstream')}>
              <i className='fas fa-satellite-dish fa-fw'></i>
              <i className='noCopy cap'> {Pref.upstream}</i>
            </MenuItem>
            
            <MenuItem onClick={()=>FlowRouter.go('/overview')}>
              <i className='fas fa-globe fa-fw'></i>
              <i className='noCopy'> Overview</i>
            </MenuItem>
            
            <MenuItem onClick={()=>FlowRouter.go('/downstream')}>
              <i className='fas fa-satellite fa-fw'></i>
              <i className='noCopy cap'> {Pref.downstream}</i>
            </MenuItem>
            
            {Roles.userIsInRole(Meteor.userId(), 'admin') ?
              <Fragment>
                <MenuItem divider />
                <MenuItem onClick={()=>FlowRouter.go('/app')}>
                  <i className='fas fa-sliders-h fa-fw'></i>
                  <i className='noCopy'> Settings</i>
                </MenuItem>
              </Fragment>
            : null}
          </Fragment> 
        : null}
      </ContextMenu>
      
      <ToastContainer
        position="top-right"
        theme='colored'
        newestOnTop 
      />
    </div>
  );
};

export default HomeIcon;