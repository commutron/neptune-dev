import React, {Component} from 'react';
import Alert from '/client/global/alert.js';

export default class OrgForm extends Component	{
  
  hndlJoin(e) {
    e.preventDefault();
    this.go.disabled = true;
    const org = this.org.value.trim();
    const pIn = this.pIn.value;
      Meteor.call('joinOrg', org, pIn, (err, reply)=>{
        if(err)
          console.log(err);
        if(reply) {
          window.location.reload(true);
        }else{
          alert('Incorrect PIN');
          this.go.disabled = false;
        }
      });
  }
  
  hndlCreate(e) {
    e.preventDefault();
    this.go.disabled = true;
    const org = this.rg.value.trim().toLowerCase();
      Meteor.call('createOrg', org, (err, reply)=>{
        if(err)
          console.log(err);
        reply ? window.location.reload(true) : false;
      });
  }

  render() {
    
    if(this.props.org) {
      return (
        <div className='centre'>
          <p>You belong to "{this.props.org}".</p>
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
              type='text'
              ref={(i)=> this.org = i}
              id='oRg'
              placeholder='Organization Name'
              required
            />
            <input
              type='password'
              ref={(i)=> this.pIn = i}
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
              ref={(i)=> this.go = i}
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
                ref={(i)=> this.rg = i}
                id='oRg'
                placeholder='Organization Name'
                required
              />
              <button
                type='submit'
                ref={(i)=> this.go = i}
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