import React, {Component} from 'react';
import Alert from '/client/global/alert.js';

export default class RemoveUser extends Component {
  
  setPin(e) {
    e.preventDefault();
    const old = this.refs.oldPin.value.trim();
    const newOne = this.refs.newOne.value.trim();
    const newTwo = this.refs.newTwo.value.trim();
    
    if(newOne === newTwo) {
      Meteor.call('setPin', old, newOne, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          Bert.alert(Alert.success);
          this.refs.oldPin.value = '';
          this.refs.newOne.value = '';
          this.refs.newTwo.value = '';
        }else{
          Bert.alert(Alert.warning);
        }
      });
    }else{
      Bert.alert(Alert.danger);
    }
  }

  render () {
    
    if(Meteor.user().power) {
      return (
        <fieldset>
          <legend>Change PIN</legend>
          <form onSubmit={this.setPin.bind(this)} autoComplete='off'>
            <p>
              <label htmlFor='old'>Old PIN</label><br />
              <input
                type='password'
                ref='oldPin'
                id='oldPin'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                placeholder='0000-9999'
                inputMode='numeric'
                autoComplete='new-password'
              /><br />
            </p>
            <br />
            <p>
              <label htmlFor='newOne'>New PIN</label><br />
              <input
                type='password'
                ref='newOne'
                id='newOne'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                placeholder='0000-9999'
                inputMode='numeric'
                autoComplete='new-password'
                required
              /><br />
              <label htmlFor='newTwo'>New PIN again</label><br />
              <input
                type='password'
                ref='newTwo'
                id='newTwo'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                placeholder='0000-9999'
                inputMode='numeric'
                autoComplete='new-password'
                required
              /><br />
            </p>
            <br />
            <p>
              <button type='submit' className='smallAction clear greenT'>Save</button>
            </p>
          </form>
        </fieldset>
        );
    }
  
  return (
    <div></div>
    );
  }
}