import React from 'react';
import { toast } from 'react-toastify';
import Pref from '/public/pref.js';

function sendReply(uID, unice, text) {
  Meteor.call('sendUserDM', uID, unice, text, true, (err)=>{
    err && console.log(err);
  });
}
  
export default function InboxToastWatch(user, unice, length, autoClose) {
  if(user?.inbox && document.querySelector('.Toastify')) {
    const uID = user._id;
    for( let note of user.inbox ) {
      if(note.unread) {
        if(user.inbox.length > length) {
          const cue = note.reply ? '/UIAlert_short.mp3' : '/UIAlert_long.mp3';
          const audioObj = new Audio(cue);
          audioObj.addEventListener("canplay", event => {
            audioObj.play();
          });
          const nKey = note.notifyKey;
          toast(
            <div className='line15x'>
              <i className="fa-solid fa-message fa-lg fa-fw gapR"></i><b>{note.title}</b><br />
              <p>{note.detail}</p>
              
              {note.replyId && 
                <p className='topLine'>{Pref.autoreply.map( (rep, ix)=>(
                  <button 
                    key={ix}
                    className='chip'
                    onClick={()=>sendReply(note.replyId, unice, rep)}
                  >{rep}</button>
                ))}</p>
              }
            </div>, {
            toastId: nKey+uID,
            autoClose: autoClose || false,
            onClick: ()=>{ Meteor.call('setReadToast', uID, nKey) },
          } );
        }
      }
    }
    return user.inbox.length;
  }
}