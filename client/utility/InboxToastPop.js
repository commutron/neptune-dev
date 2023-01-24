import React from 'react';
import { toast } from 'react-toastify';

export default function InboxToastWatch(user) {
  if(user?.inbox && document.querySelector('.Toastify')) {
    const uID = user._id;
    for( let note of user.inbox ) {
      if(note.unread) {
        const nKey = note.notifyKey;
        toast(
          <div className='line15x'>
            <i className="fa-solid fa-bell fa-lg fa-fw gapR"></i><b>{note.title}</b><br />
            <p>{note.detail}</p>
          </div>, {
          toastId: nKey+uID,
          autoClose: false,
          onClick: ()=>{ Meteor.call('setReadToast', uID, nKey) },
        } );
      }
    }
  }
}
