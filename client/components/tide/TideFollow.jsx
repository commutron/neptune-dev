import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';


const TideFollow = ({ tOpen, canMulti })=> {
  
  function doLogout() {
	  if(Meteor.user().engaged) {
      toast.warning(`You are ${Pref.engaged} on ${Meteor.user().engaged.tName.toString().split("<*>")[0]}\nCLICK TO SIGN OUT IMMEDIATELY`, 
        { autoClose: 10000,
         onClose: ()=> Meteor.logout()
        });
    }else{
		  Meteor.logout();
		  document.querySelector(':root').style.setProperty('--neptuneColor', null);
	  }
	}
  
	const go = (goto)=> {
	  if(typeof goto !== 'string') {
	    if(tOpen) {
	      openMutiTide();
	    }else{
	      Session.set('now', null);
	      Meteor.setTimeout( ()=>openMutiTide(), 1000);
	    }
	  }else if(goto?.startsWith('Eq')) {
      const eqstr = goto.split("<*>");
      Session.set('now', eqstr[0]);
      Session.set('nowSV', eqstr[1].split("[+]")[0]);
    }else{
      Session.set('now', goto);
    }
    FlowRouter.go('/production');
	};
	
	const openMutiTide = ()=> {
    const dialog = document.getElementById('multiprojdialog');
    dialog?.showModal();
  };
	
	const user = Meteor.user();
	
	if(!user) {
	  return null;
	}
	
	document.querySelector(':root').style
    .setProperty('--neptuneColor', user.customColor || null);
	
	const username = user.username;
	const usernice = username.replace(Pref.usrCut, " ");
	
	const uFl = username.charAt(0);
	const usp = username.split('.');
	const uLl = usp[1] ? usp[1].charAt(0) : username.charAt(1);
	
	const tpool = user.tidepools;
  const recent = [...new Set(tpool)];
	
	const engaged = user.engaged;
  
  const taskT = !engaged?.tTask ? '' : `, ${engaged.tTask}`;
  const taskS = !engaged?.tSubt ? '' : `, ${engaged.tSubt}`;
  const tootip = !engaged ? `No Active ${Pref.xBatch}` : 
                 engaged.task === 'MLTI' ?
                 `${Pref.xBatchs} ${engaged.tName[0]} & ${engaged.tName[1]}` :
                 engaged.tName.startsWith('Eq') ? 
                 `${engaged.tName.split("<*>")[0].substring(engaged.tName.indexOf("-")+1)}${taskT}${taskS}` :
	               `${Pref.xBatch} ${engaged.tName}${taskT}${taskS}`;
	
  return(
    <Fragment>
      <ContextMenuTrigger
  			id='tideF0ll0w1'
  			holdToDisplay={!engaged ? 1 : 500}
  			attributes={ {className: 'proRight'} }>
        <button 
          aria-label={tootip}
          onClick={()=>!engaged ? null : go(engaged?.tName)}
          className={`taskLink followTask tideFollowTip ${!engaged ? '' : 'fGreen'}`}
        ><i className='numFont up'>{uFl}{uLl}</i>
         <i className={!engaged ? '' : !tOpen ? 'spin2' : 'turn'}></i>
        </button>
      </ContextMenuTrigger>
      
      <ContextMenu id='tideF0ll0w1' className='noCopy cap vbig'>
        <MenuItem onClick={()=>FlowRouter.go('/user')}>
          <i className='fas fa-user-astronaut fa-flip-horizontal fa-fw'></i>
          <i className='noCopy'> {usernice}</i>
        </MenuItem>
        
        <MenuItem onClick={()=>FlowRouter.go('/user')} className='noCopy comfort'>
          <span>
            <i className='fas fa-envelope fa-fw'></i>
            <i> Messages</i>
          </span>
          <strong>{user.inbox?.length}</strong>
        </MenuItem>
        
        
        <MenuItem divider />
        
        {canMulti ?
          <Fragment>
            <MenuItem onClick={()=>openMutiTide()} className='line2x'>
              <i className='fa-solid fa-layer-group fa-fw gapR tealT'></i>
              <i className='noCopy cap'>Multi {Pref.xBatch} Mode</i>
            </MenuItem>
            <MenuItem divider />
          </Fragment>
        : null}
        
        <MenuItem disabled={true}>
          <i className="fas fa-street-view fa-fw"></i><i> Recent</i>
        </MenuItem>
        {recent.map( (val, ix)=>(  
          <MenuItem key={ix} onClick={()=>go(val)} className='indent3'>
            <i>{val.startsWith('Eq') ? 
              val.split("<*>")[0].substring(val.indexOf("-")+1) : val
            }</i>
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