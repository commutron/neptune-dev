import React, { /*useRef, useEffect,*/ Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import UserNice from '/client/components/smallUi/UserNice.jsx';
// import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, invertColor })=> {
  
  // const thingMounted = useRef(true);
  
  function doLogout() {
	  const tideOut = !Meteor.user().engaged ? true : 
	    confirm(`You are ${Pref.engaged} on ${Meteor.user().engaged.tName}`);
		if(tideOut) {
		  if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
    	  const sessionID = Meteor.connection._lastSessionId;
    	  const agent = window.navigator.userAgent;
      	Meteor.call('logLogInOut', false, agent, sessionID);
  	  }
		  Meteor.logout();
	  }
	}
	
  // useEffect(() => {
  //   if(!proRoute) {
  //     loopClock = Meteor.setInterval( ()=>{
  //       if(Meteor.user().engaged) {
  //         toast.dismiss();
  //         toast(<i>⏰ Remember <UserNice id={Meteor.userId()} />,
  //           you are still {Pref.engaged} with a {Pref.batch}. 
  //           <a onClick={()=>go(Meteor.user().engaged.tName)}
  //             >Go back there now</a></i>, { 
  //           autoClose: false
  //         });
  //       }
  //     },1000*60*15);
  // 	}
  //   return () => { 
  //     thingMounted.current = false;
  //     if(!proRoute) { Meteor.clearInterval(loopClock); }
  //   };
  // }, [proRoute]);
  
	const go = (goto)=> {
	  Session.set('now', goto);
    FlowRouter.go('/production');
	};
	
	const user = Meteor.user();
	const username = user ? user.username : 'ab';
	
	const uFl = username.charAt(0);
	const usp = username.split('.');
	const uLl = usp[1] ? usp[1].charAt(0) : username.charAt(1);
	
	const engaged = user ? user.engaged : false;
	const tpool = user ? user.tidepools : [];
  const recent = [...new Set(tpool)];
	
  const taskT = !engaged || !engaged.tTask ? '' : `, ${engaged.tTask}`;
  const tootip = !engaged ? `No Active ${Pref.batch}` : 
	         `${Pref.batch} ${engaged.tName}${taskT}`;
	
  return(
    <Fragment>
      <ContextMenuTrigger
  			id='tideF0ll0w1'
  			holdToDisplay={!engaged || proRoute ? 1 : 500}
  			attributes={ {className: `proRight ${invertColor ? 'invert' : ''}`} }>
        <button 
          aria-label={tootip}
          onClick={()=>go(engaged && engaged.tName)}
          className={`taskLink followTask tideFollowTip ${!engaged ? '' : 'fGreen'}`}
          disabled={!engaged}
        ><i className='numFont up'>{uFl}{uLl}</i>
         <i className={!engaged ? '' : engaged.tName !== proRoute ? 'spin2' : 'turn'}></i>
        </button>
      </ContextMenuTrigger>
      
      <ContextMenu id='tideF0ll0w1' className='noCopy cap vbig'>
        <MenuItem onClick={()=>FlowRouter.go('/user')}>
          <i className='fas fa-user-astronaut fa-flip-horizontal fa-fw'></i>
          <i className='noCopy'> {user && user.username}</i>
        </MenuItem>
        
        {recent.length > 0 && 
          <Fragment>
            <MenuItem disabled={true}>
              <i className="fas fa-street-view fa-fw"></i><i> Recent</i>
            </MenuItem>
            {recent.map( (val, ix)=>(  
              <MenuItem key={ix} onClick={()=>go(val)} className='indent3'>
                <i>{val}</i>
              </MenuItem>
            ))}
          </Fragment>
        }
        
         <MenuItem onClick={()=>doLogout()}>
          <i className='fas fa-sign-out-alt fa-fw'></i><i className='noCopy'> Sign-out</i>
        </MenuItem>
      </ContextMenu>
    </Fragment>
  );
};

function areEqual(prevProps, nextProps) {
	if( prevProps !== nextProps	) {
  	return false;
	}else{
		return true;
	}
}

export default React.memo(TideFollow, areEqual);