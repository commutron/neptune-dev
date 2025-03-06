import React, { Fragment } from 'react';
import Pref from '/public/pref.js';
import { ToastContainer } from 'react-toastify';
import { PopoverAction } from '/client/layouts/Models/Popover';

const HomeIcon = () => {

	const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
	const isReadOnly = Roles.userIsInRole(Meteor.userId(), 'readOnly');
	const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
	
  const warningLight = isDebug ? 'debugWarningLight' : '';
  
  const tgglePowerMenu = (e)=> {
    e.preventDefault();
    document.getElementById('n_logo_icon_popover')?.togglePopover();
  };
  
  const station = localStorage.getItem("local_station");
  
  return(
    <div className='homeIcon' onContextMenu={(e)=>tgglePowerMenu(e)}>
      <a className={'homeIconLink ' + warningLight} href='/' title='Home'></a>

      <ToastContainer
        position="top-right"
        theme='colored'
        newestOnTop 
      />
      
      <div 
        id="n_logo_icon_popover" 
        popover='auto' 
        className='popmenu homeMenu'
      >
        <div className='colNoWrap'>
          <i>{'Neptune v.' + Pref.neptuneVersion}</i>
          {isDebug ? <small>{Meteor.release}<br /></small> : null}
          <i>Status: {Meteor.status().status}</i>
          {Pref.stations &&
            <select 
              className='miniIn18 slimIn blackHover darkMenu whiteT' 
              onChange={(e)=>localStorage.setItem("local_station", e.target.value === false ? false : e.target.value)}
              defaultValue={station}
              required>
              <option></option>
              {Pref.stations.map((v, x)=><option key={x}>{v}</option>)}
            </select>
          }
        </div>
        
        {Meteor.userId() ? 
          <Fragment>
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/production')}
              text="Production"
              icon='fa-regular fa-paper-plane'
              lock={isReadOnly}
            />
            {/*
              <PopoverAction 
                doFunc={()=>FlowRouter.go('/process')}
                text="Process"
                icon='fa-solid fa-location-arrow'
                lock={isReadOnly}
              />
            */}
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/equipment')}
              text={Pref.equip}
              icon='fa-solid fa-robot'
            />
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/people')}
              text="People"
              icon='fa-solid fa-user-astronaut'
            />
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/data')}
              text="Explore"
              icon='fa-solid fa-rocket'
            />
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/upstream')}
              text={Pref.upstream}
              icon='fa-solid fa-satellite-dish'
            />
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/overview')}
              text="Overview"
              icon='fa-solid fa-globe'
            />
            <PopoverAction 
              doFunc={()=>FlowRouter.go('/downstream')}
              text={Pref.downstream}
              icon='fa-solid fa-satellite'
            />
            {isAdmin ?
              <PopoverAction 
                doFunc={()=>FlowRouter.go('/app')}
                text="Settings"
                icon='fa-solid fa-sliders-h'
              />
            : null}
          </Fragment>
        :null }
          
      </div>
      
      {/*Meteor.userId() && localStorage.getItem("tdfollow_help") !== "checked" ?
        <div id='tdfollow_tag' className='helpFloatTag floatTR'>
          <p><big>➚</big></p>
          <p>Click<br />to open user menu</p>
          <p>Right Click<br />to go to current or last project</p>
          <p><button
            onClick={()=>{
              document.querySelector('#tdfollow_tag')?.classList.add('hide');
              localStorage.setItem("tdfollow_help", "checked");
            }}
          >Got It</button></p>
        </div>
      :null*/}
    </div>
  );
};

export default HomeIcon;