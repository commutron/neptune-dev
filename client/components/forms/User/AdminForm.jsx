import React from 'react';

export const AdminUp = (props)=> {

  function up(e) {
    e.preventDefault();
    const pIn = this.pIn.value.trim();
    const user = props.userId;
    Meteor.call('adminUpgrade', user, pIn, (err, reply)=>{
      if(err)
        console.log(err);
      reply ? window.location.reload(true) : alert('Incorrect PIN');
    });
  }

  const self = props.userId === Meteor.userId();
  const adminOther = Roles.getUsersInRole( 'admin' ).fetch();
  
  return(
    <div>
    {!self && adminOther.length < 2 ?
      <fieldset>
        <legend>Upgrade to Admin</legend>
        <form onSubmit={(e)=>up(e)} autoComplete='off'>
          <input
            type='password'
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
          <button 
            type='submit' 
            className='smallAction clearGreen'
          >Upgrade</button>
        </form>
      </fieldset>
    : null}
    </div>
  );
};



export const AdminDown = (props)=> {
  
  function down(e) {
    const check = window.confirm('Are you sure you want to become a regular user?');
    if(check) { 
    Meteor.call('adminDowngrade', (err, reply)=>{
      if(err)
        console.log(err);
      reply ? window.location.reload(true) : alert('Rejected by server');
    });
    }else{null}
  }
    
  const self = Roles.userIsInRole(Meteor.userId(), 'admin');
  const adminOther = Roles.getUsersInRole( 'admin' ).fetch();
  
  return(
    <div>
    {self && adminOther.length > 1 ?
      <fieldset>
        <legend>Give up being an Admin</legend>
        <button
          className='action clearRed'
          onClick={(e)=>down(e)}
        >Downgrade</button>
      </fieldset>
    : null}
    </div>
  );
};