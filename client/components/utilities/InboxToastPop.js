import React from 'react';
import { toast } from 'react-toastify';

export default function InboxToastPop(prevUser, currUser) {
  if(currUser) {
    if(prevUser) {
      if(currUser.inbox && prevUser.inbox) {
        if(currUser.inbox.length > prevUser.inbox.length) {
          const newNotify = currUser.inbox[currUser.inbox.length-1];
          toast(`${String.fromCodePoint(0x1F4EC)} ${newNotify.title}: ${newNotify.detail}`, {
            autoClose: false
          } );
        }
      }
    }
  }
}

export function UnreadInboxToastPop(currUser) {
  if(currUser) {
    const uID = currUser._id;
    if(currUser.inbox) {
      for( let inbox of currUser.inbox ) {
        if(inbox.unread) {
          const nKey = inbox.notifyKey;
          toast(
            <div>
              <i className="fas fa-envelope-open-text fa-lg fa-fw"></i>  <b>{inbox.title}</b><br />
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