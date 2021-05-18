import React from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';


const InboxPanel = ({ orb, bolt, app, user, users })=> {
  
  const orderedInbox = user.inbox.sort((t1, t2)=> {
    if (moment(t1.time).isAfter(t2.time)) { return -1 }
    if (moment(t1.time).isBefore(t2.time)) { return 1 }
    return 0;
  });
  
  return (
    <div className='vspace'>
      {user.inbox.length === 0 && 
        <p className='centreText medBig darkgrayT'>No Messages <i className="fas fa-inbox"></i></p>}
      <table className=' wide cap'>
        {orderedInbox.map( (entry, index)=>{
          const link = entry.type === 'batch' ? 
                        '/data/batch?request=' + entry.keyword
                      : '';
          return(
            <tbody key={index} className=''>
              <tr>
                <td className='noRightBorder'>
                  <UnReadButton nKey={entry.notifyKey} unread={entry.unread} />
                </td>
                <td className='noRightBorder'>
                  {entry.type === 'batch' ?
                    <a href={link}>{entry.keyword.split('+')[0]}</a>
                  :
                    <i>{entry.keyword}</i>
                  }
                </td>
                <td className='noRightBorder'>
                  <b>{entry.title}</b> - {entry.detail}
                </td>
                <td className='noRightBorder'>
                  {moment(entry.time).calendar()}
                </td>
                <td>
                  <RemoveNotifyButton nKey={entry.notifyKey} />
                </td>
              </tr>
            </tbody>
        )})}
      </table>
      
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
        ><i className="far fa-circle fa-lg greenT"></i></button>
      :
        <button
          key={'unreadButton' + nKey}
          title='unread'
          onClick={()=>changeRead(nKey, unread)}
        ><i className="fas fa-circle fa-lg greenT"></i></button>
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
      ><i className="fas fa-times fa-lg redT"></i></button>
    </span>
  );
};