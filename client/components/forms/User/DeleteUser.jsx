import React from 'react';

const DeleteUser = ({ userID, isDebug })=> {
  
  function deleteForever(e) {
    const check = window.confirm('Delete this User Forever??');
    const self = Meteor.userId() === userID;
    const pin = prompt("Enter PIN", "");
    if(check && !self && pin !== undefined) {
      Meteor.call('deleteUserForever', userID, pin, (error, reply)=>{
        error && console.log(error);
        reply ? alert('Account Deleted') : alert('not allowed');
      });
    }else{
      alert('not allowed');
    }
  }

  return(
    <div>
      <p>
        <button
          type='button'
          className='miniAction red'
          onClick={(e)=>deleteForever(e)}
        >Delete User Account</button>
      </p>
    </div>
  );
};

export default DeleteUser; 