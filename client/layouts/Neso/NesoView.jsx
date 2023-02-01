import React, { Fragment, useEffect, useState }from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import InboxToastWatch from '/client/utility/InboxToastPop.js';
import Pref from '/client/global/pref.js';
import { toCap } from '/client/utility/Convert';

import Spin, { SpinWrap } from '/client/components/tinyUi/Spin';
import SignIn from '/client/components/bigUi/AccountsUI/SignIn';

import './style';

const NesoView = ({ login, uID, user, username, users })=> {
	
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

	const unice = toCap(username.replace(Pref.usrCut, " "), true);
	
	return(
	  <Fragment>
			<ToastContainer
        position="top-center"
        theme='colored'
        newestOnTop
      />
      <div className='nesoMain darkTheme'> 
  			<TopBar />
  			
  			<div className='nesoCenter thinScroll'>
    			<NotifySend unice={unice} users={users} />
    				
    			<NotifyList user={user} />
    			
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
  const [ pos, posSet ] = useState(undefined);
  if(user) {
    return(
    	<div className='nesoNav textbar noCopy'>
    	  <FakeLink name='Send' linkid='#nesend' on={!pos || pos == '#nesend'} posSet={posSet} /> 
    	  <FakeLink name='Inbox' linkid='#neinbox' on={pos == '#neinbox'} posSet={posSet} /> 
    	  <FakeLink name='Links' linkid='#nelinks' on={pos == '#nelinks'} posSet={posSet} /> 
    	</div>
    );
  }
  return(
  	<div className='nesoNav textbar noCopy'>
  	  <FakeLink name='Sign In' linkid='#nesignin' on={!pos || pos == '#nesignin'} posSet={posSet} /> 
  	  <FakeLink name='Links' linkid='#nelinks' on={pos == '#nelinks'} posSet={posSet} /> 
  	</div>
  );
};
const FakeLink = ({ name, linkid, on, posSet })=> (
  <button 
    className={`foottext textclick navclick ${on ? 'on' : ''}`}
    onClick={()=>{window.location.href=linkid;posSet(linkid)}}
    type="button"
  >{name}</button>
);

const NotifyList = ({ user })=> {
	
	useEffect( ()=> {
    InboxToastWatch(user, 5000, true);
  }, [user.inbox]);
  
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
    
  return(
    <div id="neinbox" className='nesoRight'>
      <i className='texttitle subtext'>Inbox</i>
      <div className='inboxFeed thinScroll'>
        {!(user.inbox || []).length &&
          <p className='centreText foottext'>No Messages <i className="fas fa-inbox"></i></p>
        }
        {(user.inbox || []).reverse().map( (entry)=> (
          <div key={entry.notifyKey} className={`inboxCard ${entry.unread ? 'new' : ''}`}>
            <div><i>{entry.title}</i>
              <span>
                <button
                  key={'removeButton' + entry.notifyKey}
                  title='remove'
                  onClick={()=>removeNotify(entry.notifyKey)}
                ><i className="far fa-trash-can darkgrayT fade"></i></button>
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
              </span>
            </div>
            <span>{entry.detail}</span>
            <div>{moment(entry.time).calendar()}</div>
          </div>
        ))}
      </div>

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
    const userVal = uList.find( u => u.label === this.userInput.value)?.value;
    
    if(userVal) {
      Meteor.call('sendUserDM', userVal, unice, message, (error)=>{
        error && console.log(error);
        this.typedMssg.value = "";
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
        </form>

      </div>
    </div>
  );
};