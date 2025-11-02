import React, { Fragment, useEffect, useState }from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';

const NesoInbox = ({ user, unice, users })=> {

	return(
		<Fragment>
			<NotifySend unice={unice} users={users} />
				
			<NotifyList user={user} unice={unice} />
		</Fragment>
  );
};

export default NesoInbox;

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
      {(user.inbox || []).length > 0 &&
        <div className='inboxCard'>
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
      <div className='inboxFeed thinScroll'>
        {!(user.inbox || []).length &&
          <p className='centreText foottext'>No Messages <i className="fas fa-inbox"></i></p>
        }
        {(user.inbox || []).toReversed().map( (entry)=> (
          <NotifyCardWrap 
            key={entry.notifyKey} 
            entry={entry}
            unice={unice} 
          />
        ))}
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
        <div className='rowWrapR'>
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
    
    const message = e.target.typedMssg.value;
    const tousrnm = e.target.userInput.value;
    
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
          >Messages are retained for 90 days and can be accessed by management. Message content is subject to Commutron policy and Canadian privacy laws.</p>
        </form>
      </div>
    </div>
  );
};