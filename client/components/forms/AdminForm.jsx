import React, {Component} from 'react';

export default class AdminForm extends Component	{

  up(e) {
    e.preventDefault();
    pIn = this.refs.pIn.value.trim();
    Meteor.call('adminUpgrade', pIn, (err, reply)=>{
      if (err)
        console.log(err);
      !reply ? alert('Incorrect PIN') : window.location.reload(true);
    });
  }
  
  down() {
    if(window.confirm('Are you sure you want to become a regular user?')) { 
    Meteor.call('adminDowngrade', (err, reply)=>{
      if (err)
        console.log(err);
      !reply ? alert('Rejected by server') : window.location.reload(true);
    });
    }else{null}
  }
  
  render() {
    return(
      <div>
      {Meteor.user().power ?
        !Meteor.user().admin && Meteor.users.find({admin: true}).fetch().length < 2 ?
          <div>
            <p>Enter current administrator PIN to upgrade {Meteor.user().username} to administrator</p>
            <form onSubmit={this.up.bind(this)} autoComplete='off'>
              <input
                type='password'
                ref='pIn'
                id='pIn'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='4'
                cols='4'
                placeholder='Administrator PIN'
                inputMode='numeric'
                autoComplete='new-password'
                required
              />
              <button type='submit' className='smallAction clear greenT'>Upgrade</button>
            </form>
          </div>
        : null
      : null}
      
      {Meteor.user().admin && Meteor.users.find({admin: true}).fetch().length > 1 ?
        <div>
          <p>You are one of two administrators. Click the button to give up being an administrator</p>
          <button onClick={this.down.bind(this)} className='action clear redT'>Downgrade</button>
        </div>
      : null}
      </div>
      );
  }
}