import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DeleteUser = ({ userID, isDebug })=> {
  
  const [ confirmState, confirmSet ] = useState(false);
  
  function deleteForever(e) {
    const pin = this.orgPINrmv.value;
    const self = Meteor.userId() === userID;

    if(!self && pin !== undefined) {
      Meteor.call('deleteUserForever', userID, pin, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Account Deleted') : toast.error('not allowed');
      });
    }else{
      toast.error('not allowed');
    }
    confirmSet(false);
  }

  return(
    <div>
      <p>
        <input
          id='orgPINrmv'
          autoComplete="false"
          className='miniIn12 interSelect centreText'
          pattern='[\d\d\d\d]*'
          maxLength='4'
          minLength='4'
          placeholder='PIN'
          required
        />
        <button
          type='button'
          className='miniAction red'
          onClick={(e)=>confirmSet(true)}
        >Delete User Account</button>
      </p>
      {confirmState &&
        <p><b>Delete this User Forever? </b><button
            className='miniAction red inlineButton'
            onClick={(e)=>deleteForever(e)}
          >YES</button>
          <button
            className='miniAction inlineButton'
            onClick={(e)=>confirmSet(false)}
          >NO</button>
        </p>
      }
    </div>
  );
};

export default DeleteUser; 