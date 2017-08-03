import React, {Component} from 'react';
import Alert from '/client/global/alert.js';

export default class LogoutOther extends Component {
  
  brr() {
    Meteor.logoutOtherClients( (error)=>{
      error ? Bert.alert(Alert.warning) : Bert.alert(Alert.success);
    });
  }
  
  render() {
    
    return(
      <button
        className='smallAction clear yellowT'
        onClick={this.brr}
      >Logout of all other clients</button>
    );
  }
}