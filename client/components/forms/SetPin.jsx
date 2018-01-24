import React, {Component} from 'react';
import Alert from '/client/global/alert.js';

export default class SetPin extends Component {
  
  setPin(e) {
    e.preventDefault();
    this.go.disabled = true;
    const old = this.oldPin.value.trim();
    const newOne = this.newOne.value.trim();
    const newTwo = this.newTwo.value.trim();
    
    if(newOne === newTwo) {
      Meteor.call('setPin', old, newOne, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          Bert.alert(Alert.success);
          this.oldPin.value = '';
          this.newOne.value = '';
          this.newTwo.value = '';
          this.go.disabled = false;
        }else{
          Bert.alert(Alert.warning);
          this.go.disabled = false;
        }
      });
    }else{
      Bert.alert(Alert.danger);
      this.go.disabled = false;
    }
  }
  
  clearPin() {
    const user = this.props.id;
    Meteor.call('noPin', user, (err)=>{
      if(err)
        console.log(err);
      Bert.alert(Alert.success);
    });
  }

  render () {
    return (
      <div>
        <fieldset>
          <legend>Change PIN</legend>
          <form onSubmit={this.setPin.bind(this)} autoComplete='off'>
            <p>
              <input
                type='password'
                ref={(i)=> this.oldPin = i}
                id='oldPin'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                placeholder='0000-9999'
                inputMode='numeric'
                autoComplete='new-password'
              />
              <label htmlFor='old'>Old PIN</label>
            </p>
            <p>
              <input
                type='password'
                ref={(i)=> this.newOne = i}
                id='newOne'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                placeholder='0000-9999'
                inputMode='numeric'
                autoComplete='new-password'
                required
              />
              <label htmlFor='newOne'>New PIN</label>
              <br />
              <input
                type='password'
                ref={(i)=> this.newTwo = i}
                id='newTwo'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                placeholder='0000-9999'
                inputMode='numeric'
                autoComplete='new-password'
                required
              />
              <label htmlFor='newTwo'>New PIN again</label>
            </p>
            <p>
              <button
                type='submit'
                ref={(i)=> this.go = i}
                className='smallAction clearGreen'
                disabled={false}
              >Save</button>
            </p>
          </form>
        </fieldset>
        <fieldset>
          <legend>Forgot PIN</legend>
          <button
            className='smallAction clearRed'
            onClick={this.clearPin.bind(this)}
          >Clear PIN</button>
        </fieldset>
      </div>
    );
  }
}