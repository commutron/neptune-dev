import React, {Component} from 'react';
import Alert from '/client/global/alert.js';

export default class OrgForm extends Component	{
  
  hndlJoin(e) {
    e.preventDefault();
    this.refs.go.disabled = true;
    const pIn = this.refs.pIn.value.trim();
      Meteor.call('joinOrg', pIn, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          window.location.reload(true);
        }else{
          alert('Incorrect PIN');
          this.refs.go.disabled = false;
        }
      });
  }
  
  hndlCreate(e) {
    e.preventDefault();
    this.refs.go.disabled = true;
    const org = this.refs.rg.value.trim().toLowerCase();
      Meteor.call('createOrg', org, (err, reply)=>{
        if(err)
          console.log(err);
        reply ? window.location.reload(true) : false;
      });
  }
  
  hndlLeave() {
    const pin = prompt('Poweruser PIN', '');
    Meteor.call('leaveOrg', pin, (err, reply)=>{
      if (err)
        console.log(err);
      if(reply) {
        window.location.reload(true);
      }else{
        Bert.alert(Alert.warning);
      }
    });
  }

  render() {
    
    // leaving an org is undesirable
    if(this.props.org) {
      return (
        <div>
          <label htmlFor='lv'>You belong to "{this.props.org}". Leaving is undesirable.</label>
          <button 
            onClick={this.hndlLeave}
            className='smallAction red'
            disabled={!this.props.startup}
            >Leave Organization: "{this.props.org}"
          </button>
        </div>
        );
    }

    return (
      <div className='centre'>
        <p>Your all alone. Join or create an organization</p>
        <form onSubmit={this.hndlJoin.bind(this)} autoComplete='off'>
          <p>
            <label htmlFor='pIn'>For existing organization, Enter the PIN of a poweruser</label>
          </p>
          <p>
            <input
              type='password'
              ref='pIn'
              id='pIn'
              pattern='[0000-9999]*'
              maxLength='4'
              minLength='4'
              cols='4'
              placeholder='Poweruser PIN'
              inputMode='numeric'
              autoComplete='new-password'
              required
            />
            <button
              type='submit'
              ref='go'
              className='smallAction clear'
              disabled={false}>Join
            </button>
          </p>
          </form>
          <br />
          <form onSubmit={this.hndlCreate.bind(this)} autoComplete='off'>
            <p>
              <label htmlFor='oRg'>Name of a new organization</label>
            </p>
            <p>
              <input
                type='text'
                ref='rg'
                id='oRg'
                placeholder='Organization Name'
                required
              />
              <button
                type='submit'
                ref='go'
                className='smallAction clear'
                disabled={false}>Create
              </button>
            </p>
          </form>
          <br />
      </div>
    );
  }
}