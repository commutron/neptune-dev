import React, {Component} from 'react';
import Alert from '/client/global/alert.js';

export default class EmailForm extends Component {
  
  // in progress, NOT ready for use
  
  removeEmail(e) {
    e.preventDefault(e);
    window.confirm('Are you sure you to remove your email?');
    const email = this.email.value;
    Meteor.call('emailRemove', email, (error, reply)=>{
      if(error)
        console.log(error);
      reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning);
    });
  }
  
  
  addEmail(e) {
    e.preventDefault(e);
    const newEmail = this.eml.value.trim();
    if(newEmail) {
      Meteor.call('emailSet', newEmail, (error, reply)=>{
        if(error)
          console.log(error);
        reply ? Bert.alert(Alert.success) : Bert.alert(Alert.warning);
      });
    }else{
      alert('not allowed');
    }
  }
  
  render() {
    
    return(
      <div>
      
      {
        // show verified input for new email
        // show list of emails with "x"s remove
      }
      
      </div>
    );
  }
}