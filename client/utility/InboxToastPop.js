import React from 'react';
import { toast } from 'react-toastify';

export default function InboxToastPop(currUser) {
  if(currUser) {
    const uID = currUser._id;
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