import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';

import ModelUser from '/client/layouts/Models/ModelUser';


const TideFollow = ({ tOpen, canMulti })=> {
  
	const go = (goto)=> {
	  document.getElementById('userRightPanel')?.close();
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
	
	const openPanel = ()=> {
    const dialog = document.getElementById('userRightPanel');
    dialog?.showModal();
  };
  
	const openMutiTide = ()=> {
	  document.getElementById('userRightPanel')?.close();
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
	
	const uFl = username.charAt(0);
	const usp = username.split('.');
	const uLl = usp[1] ? usp[1].charAt(0) : username.charAt(1);
	
	const engaged = user.engaged;
  
  const taskT = !engaged?.tTask ? '' : `, ${engaged.tTask}`;
  const taskS = !engaged?.tSubt ? '' : `, ${engaged.tSubt}`;
  const tootip = !engaged ? `No Active ${Pref.xBatch}` : 
                 engaged.task === 'MLTI' ?
                 `${Pref.XBatchs} ${engaged.tName[0]} & ${engaged.tName[1]}` :
                 engaged.tName.startsWith('Eq') ? 
                 `${engaged.tName.split("<*>")[0].substring(engaged.tName.indexOf("-")+1)}${taskT}${taskS}` :
	               `${Pref.XBatch} ${engaged.tName}${taskT}${taskS}`;
	
  return(
    <Fragment>
      
      <div
        id='tideF0ll0w1'
        className='proRight'
        ><button
          aria-label={tootip}
          onContextMenu={(e)=>{
            e.preventDefault();
            !engaged ? openPanel() : go(engaged?.tName);
          }}
          onClick={()=>openPanel()}
          className={`taskLink followTask tideFollowTip ${!engaged ? '' : 'fGreen'}`}
        ><i className='numFont up'>{uFl}{uLl}</i>
         <i className={!engaged ? '' : !tOpen ? 'spin2' : 'turn'}></i>
        </button>
      </div>
      
      <ModelUser 
        user={user}
        username={username+fake}
        userinitial={uFl+uLl}
        tootip={tootip}
        engaged={engaged}
        tOpen={tOpen}
        go={(e)=>go(e)}
        openMutiTide={()=>openMutiTide()}
        canMulti={canMulti}
      />
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