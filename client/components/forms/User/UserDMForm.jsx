import React from 'react';
import { toast } from 'react-toastify';

const UserDMForm = ({ userID })=> {
  
  function sendAdirect(e) {
    e.preventDefault();
    const title = this.tiTle.value;
    const message = this.mesSage.value;

    Meteor.call('sendUserDM', userID, title, message, (error)=>{
      error && console.log(error);
      toast.success('message sent');
      this.tiTle.value = "";
      this.mesSage.value = "";
    });
  }
  
  return(
    <div>
      <h3 className='cap'>Send a Notification</h3>
      <i>Causes a toast pop and a message in the user's inbox</i>
      <form>
        <label htmlFor='tiTle'>Title</label><br />
        <input type='text' id='tiTle' required/>
        <br />
        <label htmlFor='mesSage'>Message</label><br />
        <textarea id='mesSage'></textarea>
        <br />
        <button
          className='action nSolid'
          onClick={(e)=>sendAdirect(e)}
        >Send Direct Message to THIS user</button>
      </form>
    </div>
  );
};

export default UserDMForm;