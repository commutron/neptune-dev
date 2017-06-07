import React, {Component} from 'react';

export class AdminUp extends Component	{

  up(e) {
    e.preventDefault();
    const pIn = this.pIn.value.trim();
    const user = this.props.userId;
    Meteor.call('adminUpgrade', user, pIn, (err, reply)=>{
      if (err)
        console.log(err);
      reply ? window.location.reload(true) : alert('Incorrect PIN');
    });
  }
  
  render() {
    
    const self = this.props.userId === Meteor.userId();
    const adminOther = Roles.getUsersInRole( 'admin' ).fetch();
    
    return(
      <div>
      {!self && adminOther.length < 2 ?
        <fieldset>
          <legend>Upgrade to Admin</legend>
          <form onSubmit={this.up.bind(this)} autoComplete='off'>
            <input
              type='password'
              ref={(i)=> this.pIn = i}
              id='pIn'
              pattern='[0000-9999]*'
              maxLength='4'
              minLength='4'
              cols='4'
              placeholder='PIN'
              inputMode='numeric'
              autoComplete='new-password'
              required
            />
            <button type='submit' className='smallAction clear greenT'>Upgrade</button>
          </form>
        </fieldset>
      : null}
      </div>
      );
  }
}



export class AdminDown extends Component	{
  
  down() {
    if(window.confirm('Are you sure you want to become a regular user?')) { 
    Meteor.call('adminDowngrade', (err, reply)=>{
      if (err)
        console.log(err);
      reply ? window.location.reload(true) : alert('Rejected by server');
    });
    }else{null}
  }
  
  render() {
    
    const self = Roles.userIsInRole(Meteor.userId(), 'admin');
    const adminOther = Roles.getUsersInRole( 'admin' ).fetch();
    
    return(
      <div>
      {self && adminOther.length > 1 ?
        <fieldset>
          <legend>Give up being an Admin</legend>
          <button onClick={this.down.bind(this)} className='action clear redT'>Downgrade</button>
        </fieldset>
      : null}
      </div>
      );
  }
}