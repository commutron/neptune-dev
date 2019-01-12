import React from 'react';
//import '/client/stylesheets/global.css';
import './style.css';
//import { toast } from 'react-toastify';

function changeWatch(type, keyword) {
  Meteor.call('setWatchlist', type, keyword, (error)=>{
    error && console.log(error);
  });
}

function changeMute(type, keyword, mute) {
  Meteor.call('setMuteState', type, keyword, mute, (error)=>{
    error && console.log(error);
  });
}

const WatchButton = ({list, type, keyword})=> {
  
  const watching = list.find( x => x.type === type && x.keyword === keyword);
  
  return(
    <span className='watchWrap'>
      {!watching ?
        <label>Watch
          <button
            key='offButton'
            onClick={()=>changeWatch(type, keyword)}
          ><i className="far fa-eye greenT"></i></button>
        </label>
      :
        <label className='on'>Unwatch
          <button
            key='onButton'
            onClick={()=>changeWatch(type, keyword)}
          ><i className="far fa-eye-slash redT"></i></button>
        </label>
      }
    </span>
  );
};

export const MuteButton = ({type, keyword, mute})=> {

  return(
    <span className='watchWrap'>
      {!mute ?
        <label className='on'>Mute
          <button
            key='onButton'
            onClick={()=>changeMute(type, keyword, mute)}
          ><i className="far fa-bell-slash redT"></i></button>
        </label>
      :
        <label>Notify
          <button
            key='offButton'
            onClick={()=>changeMute(type, keyword, mute)}
          ><i className="far fa-bell greenT"></i></button>
        </label>
      }
    </span>
  );
};

export default WatchButton;