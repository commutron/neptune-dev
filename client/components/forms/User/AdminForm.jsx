import React, { useState } from 'react';
import { toast } from 'react-toastify';

export const AdminUp = ({ userId })=> {

  function up(e) {
    e.preventDefault();
    const pIn = this.pIn.value.trim();

    Meteor.call('adminUpgrade', userId, pIn, (err, reply)=>{
      err && console.log(err);
      reply ? null : toast.error('Incorrect PIN');
    });
  }

  const self = userId === Meteor.userId();
  const adminOther = Roles.getUsersInRole( 'admin' ).fetch();
  
  return(
    <div>
    {!self && adminOther.length < 3 ?
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
            className='smallAction nHover'
          >Upgrade</button>
        </form>
      </fieldset>
    : null}
    </div>
  );
};


export const AdminDown = ()=> {
  
  const [ confirmState, confirmSet ] = useState(false);
  
  function down(e) {
    Meteor.call('adminDowngrade', (err, reply)=>{
      err && console.log(err);
      reply ? window.location.reload(true) : toast.error('Rejected by server');
    });
  }
    
  const self = Roles.userIsInRole(Meteor.userId(), 'admin');
  const adminOther = Roles.getUsersInRole( 'admin' ).fetch();
  
  if(self) {
    return(
      <div className='bigInfoBox' 
        data-describe='Only possible if there is another administrator as one administrator is always required.'>
        <div><label htmlFor='adminnomore'>Give up being an Admin</label></div>
        <div>
          {!confirmState ?
            <button
              id='adminnomore'
              className='action clearRed'
              onClick={(e)=>confirmSet(true)}
              disabled={adminOther.length === 1}
            >Downgrade</button>
          :
            <div>
              <p><b>Are you sure? </b></p>
              <p><button
                className='action clearBlue'
                onClick={(e)=>down(e)}
                disabled={adminOther.length === 1}
              >YES, become a regular user.</button></p>
              <p><button
                className='action clearBlack'
                onClick={(e)=>confirmSet(false)}
                disabled={adminOther.length === 1}
              >NO, stay an admin.</button></p>
            </div>
          }
        </div>
      </div>
    );
  }
  
  return null;
};