import React from 'react';
//import '/client/stylesheets/global.css';
import './style.css';
//import { toast } from 'react-toastify';

function changeWatch(type, keyword) {
  Meteor.call('setWatchlist', type, keyword, (error)=>{
    error && console.log(error);
  });
}
function changeMute(wKey, mute) {
  Meteor.call('setMuteState', wKey, mute, (error)=>{
    error && console.log(error);
  });
}

function changeRead(nKey, read) {
  Meteor.call('setNotifyAsRead', nKey, read, (error)=>{
    error && console.log(error);
  });
}
function removeNotify(nKey) {
  Meteor.call('removeNotify', nKey, (error)=>{
    error && console.log(error);
  });
}

const WatchButton = ({list, type, keyword, unique, iconOnly})=> {
  
  const watching = list.find( x => x.type === type && x.keyword === keyword);
  
  return(
    <span className='watchWrap'>
      {!watching ?
        <label 
          title='Start Watching'
          className='offWatchButton'
        >{iconOnly ? null : <i className='gap'>Watching</i>}
          <button
            key={'offWatchButton' + unique}
            onClick={()=>changeWatch(type, keyword)}
          ><i className='far fa-eye-slash grayT'></i></button>
        </label>
      :
        <label 
          className='on onWatchButton'
          title='Stop Watching'
        >{iconOnly ? null : <i className='gap'>Watching</i>}
          <button
            key={'onWatchButton' + unique}
            onClick={()=>changeWatch(type, keyword)}
          ><i className='far fa-eye greenT'></i></button>
        </label>
      }
    </span>
  );
};

export const MuteButton = ({wKey, mute})=> {

  return(
    <span className='watchWrap'>
      {!mute ?
        <label
          title='Turn OFF notifications'
          className='on onMuteButton'><i className='gap'>Notify</i>
          <button
            key={'onMuteButton' + wKey}
            onClick={()=>changeMute(wKey, mute)}
          ><i className='far fa-bell greenT'></i></button>
        </label>
      :
        <label
          title='Turn ON notifications'
          className='offMuteButton'><i className='gap'>Notify</i>
          <button
            key={'offMuteButton' + wKey}
            onClick={()=>changeMute(wKey, mute)}
          ><i className='far fa-bell-slash grayT'></i></button>
        </label>
      }
    </span>
  );
};

export const UnReadButton = ({nKey, unread})=> {

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

export const RemoveNotifyButton = ({nKey})=> {
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

export default WatchButton;