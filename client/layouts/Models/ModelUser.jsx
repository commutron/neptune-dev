import React, { useState, Fragment, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import InboxToastWatch from '/client/utility/InboxToastPop.js';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';


const ModelUser = ({ 
  user, username, userinitial, tootip,
  engaged, tOpen, go, openMutiTide, canMulti,
  users
})=> {
  
  const unice = toCap(username.replace(Pref.usrCut, " "), true);
  const tpool = user.tidepools;
  const recent = [...new Set(tpool)];
  
  const [ ibxLength, ibxSet ] = useState(0);
  useEffect( ()=> {
    ibxSet(InboxToastWatch(user, unice, ibxLength) || 0);
  }, [user.inbox?.length]);
  
  const close = ()=> {
    document.getElementById('userRightPanel')?.close();
  };

  useEffect( ()=> {
    const dialog = document.getElementById('userRightPanel');
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
	  }
	};
	
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
                !engaged ? user.tidepools ? go(user.tidepools?.[0]) : close() : go(engaged?.tName);
              }}
              onClick={()=>close()}
              className={`taskLink followTask ${!engaged ? '' : 'fGreen'}`}
            ><i className='numFont up'>{userinitial}</i>
             <i className={!engaged ? '' : !tOpen ? 'spin2' : 'turn'}></i>
            </button>
          </span>
        </span>
        
        <UserMenuElement
          title={unice}
          doFunc={()=>FlowRouter.go('/user')}
          icon='fas fa-user-astronaut fa-flip-horizontal'
        />
        
        <Divider />
        
        {canMulti ?
          <Fragment>
            <UserMenuElement
              title={`Multi ${Pref.XBatch} Mode`}
              doFunc={()=>openMutiTide()}
              icon='fa-solid fa-layer-group tealT'
              addclass='thick'
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
        
        <UserMenuElement
          title='Messages'
          doFunc={()=>FlowRouter.go('/user?slide=5')}
          icon='fa-solid fa-message'
          tag={user.inbox?.length}
        />
        
        <div className='userMenuPing thinScroll'> 
          <NotifyMini
            inbox={user.inbox}
            unice={unice}
            users={users}
          />
        </div>
         
        <div className='flexSpace' />
        
        <Divider />
        
        <UserMenuElement
          title='Sign-out'
          doFunc={()=>doLogout()}
          icon='fas fa-sign-out-alt'
          addclass='thick'
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
    borderBottom: '1px solid rgb(100,100,100,0.5)'
  }}></div>
);

const NotifyMini = ({ unice, inbox, users })=> {
  
  const [ tab, tabSet ] = useState(1);
  const [ uList, uListSet ] = useState([]);
  
  useEffect( ()=>{
    if(users.length > 1) {
      const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') );
      
      let listUsers = [];
      for(let x of liveUsers) {
        listUsers.push({ 
          label: toCap(x.username.replace(Pref.usrCut, " "), true),
          value: x._id
        });
      }
      uListSet(listUsers);
    }
  }, [users]);
  
  function userCheck(target) {
    let match = uList.find( x => x.label === target.value);
    let message = !match ? 'Exact match not found. Please choose user from the list' : '';
    target.setCustomValidity(message);
  }
  
  function sendOneToOne(e) {
    e.preventDefault();
  
    const message = e.target.typedMssg.value;
    const tousrnm = e.target.userSend.value;
    
    const userVal = uList.find( u => u.label === tousrnm)?.value;
    
    if(userVal) {
      Meteor.call('sendUserDM', userVal, unice, message, (error, re)=>{
        error && console.log(error);
        e.target.typedMssg.value = "";
        
        if(re === 'ether') {
          toast(
            <div className='line15x'>
              <i className="fa-solid fa-ghost fa-lg fa-fw gapR"></i><b>{tousrnm} Is Away</b><br />
              <p><small>Message is delivered but the recipient is not currently logged in.</small></p>
            </div>, {
            autoClose: 10000,
            icon: false
          });
        }
      });
    }
  }
	
  return(
    <div>
      <div className='notifytabs'>
        <button className={tab ? 'on' : ''} onClick={()=>tabSet(1)}>Send</button>
        <button className={!tab ? 'on' : ''} onClick={()=>tabSet(0)}>Inbox</button>
      </div>
      
      {tab ?
        <div>
          <form onSubmit={(e)=>sendOneToOne(e)}>
            <p>
              <label htmlFor='userSend'>Send To</label><br />
              <input 
                id='userSend'
                type='search'
                list='userDatalist'
                onInput={(e)=>userCheck(e.target)}
                required
                autoComplete={navigator.userAgent.indexOf("Firefox") !== -1 ? "off" : ""}
              />
              <datalist id='userDatalist'>
              {uList.map( (e)=>(
                <option 
                  key={e.value}
                  value={e.label}
                />
              ))}
              </datalist>
            </p>
            <p>
              <label htmlFor='typedMssg'>Message</label><br />
              <textarea id='typedMssg' rows={2}
                required></textarea>
            </p>
            <p>
              <button
                type='submit'
                className='darkMenu'
              >Send</button>
            </p>
          </form>
          
          <p className='smaller darkgrayT line15x'
          >Messages are retained for 90 days and can be accessed by management. Message content is subject to Commutron policy and Canadian privacy laws.</p>
        </div>
        :
        <div>
          {(inbox || []).slice(0).reverse().map( (entry)=> (
            <div key={entry.notifyKey} className={`mininboxCard ${entry.unread ? 'new' : ''}`}>
              <div><i>{entry.title}</i></div>
              <span>{entry.detail}</span>
              <div>{moment(entry.time).calendar()}</div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};