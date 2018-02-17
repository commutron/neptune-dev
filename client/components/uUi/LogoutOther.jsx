import React from 'react';
import Alert from '/client/global/alert.js';

function brr() {
  Meteor.logoutOtherClients( (error)=>{
    error ? Bert.alert(Alert.warning) : Bert.alert(Alert.success);
  });
  Session.set('loggedIn', true);
}
    
const LogoutOther = () => (
  <button
    className='smallAction clear yellowT'
    onClick={brr}
  >Logout of all other clients</button>
);

export default LogoutOther;