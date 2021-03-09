import React from 'react';
import { toast } from 'react-toastify';

export default function InboxToastPop(currUser, app) {
  if(currUser) {
    const uID = currUser._id;
    if(app) {
      if(app.dailyEvent === 1) {
        const audioObj = new Audio('/pacman.wav');
      
        audioObj.addEventListener("canplay", event => {
          audioObj.play();
        
          toast(
            <div>
              <i className="fas fa-utensils fa-lg fa-fw"></i> <b>Lunch Break</b><br />
            </div>, {
            autoClose: false,
          } );
        
        });
      }
    }
    if(currUser.inbox) {
      for( let inbox of currUser.inbox ) {
        if(inbox.unread) {
          const nKey = inbox.notifyKey;
          toast(
            <div>
              <i className="fas fa-envelope-square fa-lg fa-fw"></i><b>New Message</b><br />
              <h4>{inbox.title}</h4>
              <hr />
              <p>{inbox.detail}</p>
            </div>, {
            autoClose: false,
            onClose: ()=>{ Meteor.call('setReadToast', uID, nKey) },
          } );
        }
      }
    }
  }
}