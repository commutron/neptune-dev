import React from 'react';
import moment from 'moment';


const InboxPanel = ({ app, user, users })=> {
  
  const orderedInbox = user.inbox.sort((t1, t2)=>
                        moment(t1.time).isAfter(t2.time) ? -1 :
                        moment(t1.time).isBefore(t2.time) ? 1 : 0 );
  
  return(
    <div className='space5x5'>
      {user.inbox.length === 0 && 
        <p className='centreText medBig darkgrayT'>No Messages <i className="fas fa-inbox"></i></p>}
      <div className='wide'>
        {orderedInbox.map( (entry)=> (
          <div key={entry.notifyKey} className={`inboxCard light ${entry.unread ? 'new' : ''}`}>
            <div><i>{entry.title}</i>
              <span>
                <RemoveNotifyButton nKey={entry.notifyKey} />
                <UnReadButton nKey={entry.notifyKey} unread={entry.unread} />
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

export default InboxPanel;


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
        ><i className="far fa-circle fa-lg nT"></i></button>
      :
        <button
          key={'unreadButton' + nKey}
          title='unread'
          onClick={()=>changeRead(nKey, unread)}
        ><i className="fas fa-circle fa-lg nT"></i></button>
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
      ><i className="far fa-trash-can fa-lg redT"></i></button>
    </span>
  );
};