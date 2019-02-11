import { toast } from 'react-toastify';

function InboxToast(prevProps, currProps) {
  if(currProps.user) {
    if(prevProps.user) {
      if(currProps.user.inbox && prevProps.user.inbox) {
        if(currProps.user.inbox.length > prevProps.user.inbox.length) {
          const newNotify = currProps.user.inbox[currProps.user.inbox.length-1];
          toast(String.fromCodePoint(0x1F4EC) + ' ' + newNotify.title, {autoClose: false} );
        }
      }
    }
  }
}

export default InboxToast;