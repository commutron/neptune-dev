import React from 'react';
import { toast } from 'react-toastify';

function brr() {
  Meteor.logoutOtherClients( (error)=>{
    error ? toast.error('Server Error') : toast.success('Saved');
  });
}
    
const LogoutOther = () => (
  <button
    className='action clean clearBlue'
    onClick={brr}
  >Sign-out All Other Terminals</button>
);

export default LogoutOther;