import { toast } from 'react-toastify';

export default function InboxToastPop(prevUser, currUser) {
  if(currUser) {
    if(prevUser) {
      if(currUser.inbox && prevUser.inbox) {
        if(currUser.inbox.length > prevUser.inbox.length) {
          const newNotify = currUser.inbox[currUser.inbox.length-1];
          toast(`${String.fromCodePoint(0x1F4EC)} ${newNotify.title}: ${newNotify.detail}`, {autoClose: false} );
        }
      }
    }
  }
}