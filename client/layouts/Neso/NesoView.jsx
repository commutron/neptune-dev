import React, { Fragment, useEffect, useState }from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toCap } from '/client/utility/Convert';

import { SpinWrap } from '/client/components/tinyUi/Spin';
import SignIn from '/client/components/bigUi/AccountsUI/SignIn';

import './style';

const NesoView = ({ login, user, username, users })=> {
	
	if(Meteor.loggingIn()) {
    return(
      <SpinWrap color={true} />
    );
  }
  
  const bttn = {
	  height: '32px',
	  minWidth: '100%',
	  width: '100%',
	  maxWidth: '100%',
	  marginTop: '0.75rem',
	  fontSize: 'medium',
	  fontWeight: '600',
	  color: 'rgb(20,20,20)',
	  textAlign: 'center',
	  letterSpacing: '1.5px',
	  cursor: 'pointer'
	};
	
	let mxW = { maxWidth: '300px' };
	let pad = { padding: '0 25px' };
	
  if(!login) {
	  return(
	    <div className='nesoMain darkTheme'>
	    	<TopBar />
	      <div className='nesoCenter thinScroll'>
	        <div id='nesignin' className='nesoFloat'>
	          <SignIn mxW={mxW} pad={pad} bttn={bttn} />
	         </div>
	        <BotBar />
	      </div>
	      <NavBar />
	    </div>
  	);
  }
  
  if(!user || !users) {
    return(
      <SpinWrap color={true} />
    );
  }
    
  document.querySelector(':root').style
    .setProperty('--neptuneColor', user.customColor || null);
  
  if(!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  }else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
    
	const unice = toCap(username.replace(Pref.usrCut, " "), true);
  
	return(
	  <Fragment>
			<ToastContainer
        position="top-right"
        theme='colored'
        newestOnTop
        pauseOnVisibilityChange
        pauseOnHover
      />
      <div className='nesoMain darkTheme'> 
  			<TopBar />
  			
  			<div className='nesoCenter thinScroll'>
    			<NotifySend unice={unice} users={users} />
    				
    			<NotifyList user={user} unice={unice} />
    			
    			<BotBar unice={unice} />
    		</div>
  			
  			<NavBar user={true} />
  		</div>
  	</Fragment>
  );
};

	
export default withTracker( ({}) => {
  let login = Meteor.userId() ? true : false;
  let uID = Meteor.userId() || false;
  let user = login ? Meteor.user() : false;
  let username = user ? user.username : false;
  
  return {
  	login: login,
  	uID: uID,
    user: user,
    username: username,
    users: Meteor.users.find( {}, { sort: { username: 1 } } ).fetch(),
  };
})(NesoView);

const TopBar = ()=> (
	<div className='nesoHead textbar noCopy'>
		<i className='headtext texttitle'><i className="fa-regular fa-circle-dot gapR nT fadeMore"></i>Ne</i>
		<span className='flexSpace' />
	</div>
);

const BotBar = ({unice})=> (
	<div id="nelinks" className='nesoFoot textbar noCopy'>
		<i className='nT fadeMore foottext texttitle'>|</i>
		<a className='foottext textclick' href='/'>Home</a>
		<i className='nT fadeMore foottext texttitle'>|</i>
		<a className='foottext textclick' href='/user'>{unice || 'Account'}</a>
		<i className='nT fadeMore foottext texttitle'>|</i>
		<button className='foottext textclick' onClick={()=>Meteor.logout()}>Sign-Out</button>
		<i className='nT fadeMore foottext texttitle'>|</i>
	</div>
);

const NavBar = ({ user })=> {
  if(user) {
    return(
    	<div className='nesoNav textbar noCopy'>
    	  <FakeLink name='Send' linkid='#nesend' /> 
    	  <FakeLink name='Inbox' linkid='#neinbox' /> 
    	  <FakeLink name='Links' linkid='#nelinks' /> 
    	</div>
    );
  }
  return(
  	<div className='nesoNav textbar noCopy'>
  	  <FakeLink name='Sign In' linkid='#nesignin' /> 
  	  <FakeLink name='Links' linkid='#nelinks' /> 
  	</div>
  );
};
const FakeLink = ({ name, linkid })=> (
  <button 
    className='foottext textclick navclick'
    onClick={()=>window.location.href=linkid}
    type="button"
  >{name}</button>
);

const NotifyList = ({ user, unice })=> {
	
	const [ ibxLength, ibxSet ] = useState(0);
	useEffect( ()=> {
    if(user?.inbox) {
      for( let note of user.inbox ) {
        if(note.unread) {
          if(user.inbox.length > ibxLength) {
            if (
              ( !(navigator.userAgent.match(/Android/i) ||
              navigator.userAgent.match(/iPhone/i) ||
              navigator.userAgent.match(/iPad/i)) )
              && Notification?.permission === "granted"
            ) {
              new Notification(note.title, {
                silent: false,
                body: note.detail,
              });
            }else{
              const cue = note.reply ? '/UIAlert_short.mp3' : '/UIAlert_long.mp3';
              const audioObj = new Audio(cue);
              audioObj.addEventListener("canplay", event => {
                audioObj.play();
              });
            }
            window.location.href='#neinbox';
          }
        }
      }
      ibxSet(user.inbox.length);
    }
  }, [user.inbox?.length]);
  
  function bulkAction(action) {
    Meteor.call(action, (error)=>{
      error && console.log(error);
    });
  }
  
  return(
    <div id="neinbox" className='nesoRight'>
      <i className='texttitle subtext'>Inbox</i>
      <div className='inboxFeed thinScroll'>
        {!(user.inbox || []).length &&
          <p className='centreText foottext'>No Messages <i className="fas fa-inbox"></i></p>
        }
        {(user.inbox || []).slice(0).reverse().map( (entry)=> (
          <NotifyCardWrap 
            key={entry.notifyKey} 
            entry={entry}
            unice={unice} 
          />
        ))}
        {(user.inbox || []).length > 0 &&
          <div className='inboxCard vmargin'>
            <div><i></i>
              <div>
                <button onClick={()=>bulkAction('setReadAllInbox')}
                ><i className="far fa-circle-check darkgrayT fade gapR"></i>READ ALL
                </button>
                <button onClick={()=>bulkAction('removeAllInbox')}
                ><i className="fas fa-trash-can darkgrayT fade gapR"></i>DELETE ALL
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

const NotifyCardWrap = ({ entry, unice })=> {
  
  const [ re, reSet ] = useState(false);
  
  function removeNotify(nKey) {
    Meteor.call('removeNotify', nKey, (error)=>{
      error && console.log(error);
    });
  }
  
  function changeRead(nKey, read) {
    Meteor.call('setNotifyAsRead', nKey, read, (error)=>{
      error && console.log(error);
    });
  }
  
  function sendReply(uID, unice, text) {
    Meteor.call('sendUserDM', uID, unice, text, true, (err)=>{
      err && console.log(err);
      reSet(false);
    });
  }
  
  return(
    <div className={`inboxCard ${entry.unread ? 'new' : ''}`}>
      <div><i>{entry.title}</i>
        <div>
          {entry.replyId &&
            <button title='reply' onClick={()=>reSet(!re)}
              ><i className="fas fa-reply darkgrayT fade"></i>
            </button>
          }
          {entry.unread ?
            <button
              key={'readButton' + entry.notifyKey}
              title='read'
              onClick={()=>changeRead(entry.notifyKey, true)}
            ><i className="fas fa-circle nT"></i></button>
          :
            <button
              key={'unreadButton' + entry.notifyKey}
              title='unread'
              onClick={()=>changeRead(entry.notifyKey, false)}
            ><i className="far fa-circle darkgrayT fade"></i></button>
          }
          <button
            key={'removeButton' + entry.notifyKey}
            title='remove'
            onClick={()=>removeNotify(entry.notifyKey)}
          ><i className="far fa-trash-can darkgrayT fade"></i></button>
        </div>
      </div>
      <span>{entry.detail}</span>
      <div>{moment(entry.time).calendar()}</div>
      {re && 
        <p>{Pref.autoreply.map( (rep, ix)=>(
          <button 
            key={ix}
            className='chip'
            onClick={()=>sendReply(entry.replyId, unice, rep)}
          >{rep}</button>
        ))}</p>
      }
    </div>
  );
};

const NotifySend = ({ unice, users })=> {
  
  const [ uList, uListSet ] = useState([]);
  
  useEffect( ()=>{
  	if(users.length > 1) {
	    let listUsers = [];
      for(let x of users) {
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
    let message = !match ? 'User ID not found. Please choose user from the list' : '';
    target.setCustomValidity(message);
  }
  
  function sendOneToOne(e) {
    e.preventDefault();
    
    const message = this.typedMssg.value;
    const tousrnm = this.userInput.value;
    
    const userVal = uList.find( u => u.label === tousrnm)?.value;
    
    if(userVal) {
      Meteor.call('sendUserDM', userVal, unice, message, (error, re)=>{
        error && console.log(error);
        this.typedMssg.value = "";
        
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
    <div id="nesend" className='nesoLeft'>
      <i className='texttitle subtext'>Send</i>
      <div className='nesoSend thinScroll'>
        <form onSubmit={(e)=>sendOneToOne(e)}>
          <p>
            <label htmlFor='userInput headtext'>Send To</label><br />
            <input 
              id='userInput'
              className=''
              type='search'
              placeholder=''
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
                // label={e.value}
              />
            ))}
            </datalist>
          </p>
          <p>
            <label htmlFor='typedMssg'>Message</label><br />
            <textarea id='typedMssg' rows={4}
              required></textarea>
          </p>
          <p>
            <button
              type='submit'
              className='darkMenu'
            >Send</button>
          </p>
        
          <p className='vmargin smaller darkgrayT line15x'
          >Messages are temporarily logged for the purposes of management oversight and user safety.  Message logs can be accessed by administrators and management.  Logs are subject to Commutron policy and Canadian privacy laws.  Logs are automatically deleted after 90 days.</p>
        </form>
      </div>
    </div>
  );
};