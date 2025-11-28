import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toCap } from '/client/utility/Convert';


const InboxPanel = ({ app, user, users })=> {
  
  const unice = toCap(user.username.replace(Pref.usrCut, " "), true);
  
  function bulkAction(action) {
    Meteor.call(action, (error)=>{
      error && console.log(error);
    });
  }
  
  return(
    <div className='space5x5'>
      <div className='wide max875'>
        <p className='rightText vmargin'><a href={'/ne/inbox'} target='_blank'>Open Standalone Message Center</a></p>
        {user.inbox.length > 0 ?
          <div className='inboxCard light vmargin'>
            <div><span></span>
              <div>
                <button onClick={()=>bulkAction('setReadAllInbox')}
                ><i className="far fa-circle-check nT gapR"></i>READ ALL
                </button>
                <button onClick={()=>bulkAction('removeAllInbox')}
                ><i className="fas fa-trash-can redT gapR"></i>DELETE ALL
                </button>
              </div>
            </div>
          </div>
          :
          <p className='centreText medBig darkgrayT'>No Messages <i className="fas fa-inbox"></i></p>
        }
        {(user.inbox || []).toReversed().map( (entry)=> (
          <InboxCardWrap 
            key={entry.notifyKey} 
            entry={entry}
            unice={unice} 
          />
        ))}
      </div>
    </div>
  );
};

export default InboxPanel;

const InboxCardWrap = ({ entry, unice })=> {
  
  const [ re, reSet ] = useState(false);
  
  function sendReply(uID, unice, text) {
    Meteor.call('sendUserDM', uID, unice, text, true, (err)=>{
      err && console.log(err);
      reSet(false);
    });
  }
  
  return(
    <div key={entry.notifyKey} className={`inboxCard light ${entry.unread ? 'new' : ''}`}>
      <div><i>{entry.title}</i>
        <div>
          {entry.replyId &&
            <button title='reply' onClick={()=>reSet(!re)}
              ><i className="fas fa-reply blueT"></i>
            </button>
          }
          <UnReadButton nKey={entry.notifyKey} unread={entry.unread} />
          <RemoveNotifyButton nKey={entry.notifyKey} />
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
  
const UnReadButton = ({nKey, unread})=> {
  
  function changeRead(nKey, read) {
    Meteor.call('setNotifyAsRead', nKey, read, (error)=>{
      error && console.log(error);
    });
  }

  return(
    <span className='notifyWrap'>
      {!unread ?
        <button
          key={'readButton' + nKey}
          title='read'
          onClick={()=>changeRead(nKey, unread)}
        ><i className="far fa-circle nT"></i></button>
      :
        <button
          key={'unreadButton' + nKey}
          title='unread'
          onClick={()=>changeRead(nKey, unread)}
        ><i className="fas fa-circle nT"></i></button>
      }
    </span>
  );
};

const RemoveNotifyButton = ({nKey})=> {
  
  function removeNotify(nKey) {
    Meteor.call('removeNotify', nKey, (error)=>{
      error && console.log(error);
    });
  }

  return(
    <span className='notifyWrap'>
      <button
        key={'removeButton' + nKey}
        title='remove'
        onClick={()=>removeNotify(nKey)}
      ><i className="far fa-trash-can redT"></i></button>
    </span>
  );
};