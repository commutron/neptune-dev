import React, { Fragment, useEffect } from 'react';
import { toast } from 'react-toastify';
import Pref from '/client/global/pref.js';
import { toCap } from '/client/utility/Convert';

const ModelUser = ({ 
  user, username, userinitial, tootip,
  engaged, tOpen, go, openMutiTide, canMulti 
})=> {
  
  const close = ()=> {
    const dialog = document.getElementById('userRightPanel');
    dialog?.close();
  };

  useEffect( ()=> {
    const dialog = document.querySelector("#userRightPanel");
    dialog.addEventListener("click", (ev)=> 
      ev.target.id === 'userRightPanel' ? close() : null );
  }, []);

  const doLogout = ()=> {
	  if(Meteor.user().engaged) {
      toast.warning(`You are ${Pref.engaged} on ${Meteor.user().engaged.tName.toString().split("<*>")[0]}\nCLICK TO SIGN OUT IMMEDIATELY`, 
        { autoClose: 10000,
         onClose: ()=> Meteor.logout(),
         onClick: ()=> Meteor.logout()
        });
    }else{
		  Meteor.logout();
		  document.querySelector(':root').style.setProperty('--neptuneColor', null);
	  }
	};
	
  const tpool = user.tidepools;
  const recent = [...new Set(tpool)];
	
  return(
    <dialog 
      id='userRightPanel'
      className={`darkTheme`}
    >
      <div id='userPanelContent' className='thinScroll column'>
        <span className='userMenuTop'>
          {!engaged ? <span /> :
            <UserMenuElement
              title={tootip}
              doFunc={()=>go(engaged?.tName)}
              icon='fas fa-paper-plane greenT'
            />
          }

          <span className='userMenuTopTide'>
            <button
              onContextMenu={(e)=>{
                e.preventDefault();
                !engaged ? close() : go(engaged?.tName);
              }}
              onClick={()=>close()}
              className={`taskLink followTask ${!engaged ? '' : 'fGreen'}`}
            ><i className='numFont up'>{userinitial}</i>
             <i className={!engaged ? '' : !tOpen ? 'spin2' : 'turn'}></i>
            </button>
          </span>
        </span>
        
        <Divider />
        
        {canMulti ?
          <Fragment>
            <UserMenuElement
              title={`Multi ${Pref.XBatch} Mode`}
              doFunc={()=>openMutiTide()}
              icon='fa-solid fa-layer-group tealT'
              addclass='line2x'
            />
            <Divider />
          </Fragment>
        : null}
        
        <div className='subsection noCopy'>
          <i className="fas fa-street-view fa-fw"></i><i> Recent</i>
        </div>
        
        {recent.map( (val, ix)=>(
          <UserMenuElement
            key={ix}
            title={val.startsWith('Eq') ? 
              val.split("<*>")[0].substring(val.indexOf("-")+1) : val
            }
            doFunc={()=>go(val)}
            addclass='indent'
          />
        ))}
        
        <Divider />
        
        <div className='subsection noCopy cap'>
          <i className="fas fa-user-astronaut fa-flip-horizontal fa-fw gapR"></i><i>{username.replace(Pref.usrCut, " ")}</i>
        </div>
        
        <UserMenuElement
          title='Account'
          doFunc={()=>FlowRouter.go('/user')}
          icon='fas fa-user-clock'
          addclass='indent'
        />
        
        <div>
        
          <UserMenuElement
            title='Messages'
            doFunc={()=>FlowRouter.go('/user')}
            icon='fas fa-envelope'
            tag={user.inbox?.length}
          />
        
        </div>
         
        <div className='flexSpace' />
        
        <Divider />
        
        <UserMenuElement
          title='Sign-out'
          doFunc={()=>doLogout()}
          icon='fas fa-sign-out-alt'
          addclass='line2x'
        />
       
      </div>
    </dialog>
  );
};

export default ModelUser;

const UserMenuElement = ({ title, tag, doFunc, icon, iconAdj, addclass, lock }) => (
  <button
    aria-label={toCap(title, true)}
    className={`usermenuaction comfort noCopy cap ${addclass}`}
    onClick={doFunc}
    disabled={lock}
  ><span>
    {icon && <i className={`${icon} fa-fw gapR`} data-fa-transform={iconAdj}></i>}
    <i>{title}</i>
   </span>
   <strong>{tag}</strong>
  </button>
);

const Divider = ()=> (
  <div style={{
    marginBottom: '4px',
    paddingTop: '4px',
    borderBottom: '1px solid rgb(100,100,100)',
    borderBottom: '1px solid rgba(100,100,100,0.5)',
  }}></div>
);