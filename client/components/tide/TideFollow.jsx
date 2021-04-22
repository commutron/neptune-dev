import React, { /*useRef, useEffect,*/ Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import { toast } from 'react-toastify';

const TideFollow = ({ proRoute, invertColor })=> {
  
  // const thingMounted = useRef(true);
  
  function doLogout() {
	  const tideOut = !Meteor.user().engaged ? true : 
	    confirm(`You are ${Pref.engaged} on ${Meteor.user().engaged.tName}`);
		if(tideOut) {
		  Meteor.logout();
	  }
	}
  
	const go = (goto)=> {
	  Session.set('now', goto);
    FlowRouter.go('/production');
	};
	
	const user = Meteor.user();
	const username = user ? user.username : '__';
	const usernice = username.replaceAll(Pref.usrCut, " ");
	
	const uFl = username.charAt(0);
	const usp = username.split('.');
	const uLl = usp[1] ? usp[1].charAt(0) : username.charAt(1);
	
	const engaged = user ? user.engaged : false;
	const tpool = user ? user.tidepools : [];
  const recent = [...new Set(tpool)];
	
  const taskT = !engaged || !engaged.tTask ? '' : `, ${engaged.tTask}`;
  const tootip = !engaged ? `No Active ${Pref.xBatch}` : 
	         `${Pref.xBatch} ${engaged.tName}${taskT}`;
	
  return(
    <Fragment>
      <ContextMenuTrigger
  			id='tideF0ll0w1'
  			holdToDisplay={!engaged ? 1 : 500}
  			attributes={ {className: `proRight ${invertColor ? 'invert' : ''}`} }>
        <button 
          aria-label={tootip}
          onClick={()=>!engaged ? null :go(engaged && engaged.tName)}
          className={`taskLink followTask tideFollowTip ${!engaged ? '' : 'fGreen'}`}
        ><i className='numFont up'>{uFl}{uLl}</i>
         <i className={!engaged ? '' : engaged.tName !== proRoute ? 'spin2' : 'turn'}></i>
        </button>
      </ContextMenuTrigger>
      
      <ContextMenu id='tideF0ll0w1' className='noCopy cap vbig'>
        <MenuItem onClick={()=>FlowRouter.go('/user')}>
          <i className='fas fa-user-astronaut fa-flip-horizontal fa-fw'></i>
          <i className='noCopy'> {usernice}</i>
        </MenuItem>
        <MenuItem divider />
        <MenuItem disabled={true}>
          <i className="fas fa-street-view fa-fw"></i><i> Recent</i>
        </MenuItem>
        {recent.map( (val, ix)=>(  
          <MenuItem key={ix} onClick={()=>go(val)} className='indent3'>
            <i>{val}</i>
          </MenuItem>
        ))}
        <MenuItem divider />
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