import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const NotifySlide = ({app})=> {
  
  function showToast() {
    toast('a default message');
    toast.info('A blue info message');
    toast.success('A green info message');
    toast.warn('A orange warning message');
    toast.error('A red error message');
    
    toast.success('no timeout', { autoClose: false });
  }
  
  function sendAtestNotify(e, all) {
    e.preventDefault();
    const title = this.tiTle.value;
    const message = this.mesSage.value;
    
    Meteor.call('sendTestMail', all, title, message, (error)=>{
      error && console.log(error);
      toast.success('message sent');
    });
  }
  
  function sendTestEmail(e) {
    e.preventDefault();
    
    const to = this.toEmail.value;
    
    Meteor.call(
      'sendEmail',
      to,
      'TEST - Hello from Neptune!',
      (err, re)=> {
        err && console.log(err);
        re ? toast('Email Sent') : toast.warn('Invalid Email');
      }
    );
  }
  
  return(
    <div className='space3v'>
      <h2 className='cap'>Notification Styles:</h2>
      <i>available toast notification styles</i>
      <p>
        <button
          className='action clearBlue invert'
          onClick={()=>showToast()}
        >Test Toast Notifications</button>
      </p>
      
      <hr />
      
      <h2 className='cap'>Send a Notification</h2>
      <i>Causes a toast pop and a message in the user's inbox</i>
      <form>
        <input type='text' id='tiTle' />
        <br />
        <textarea id='mesSage'></textarea>
        <br />
        <button
          className='action clearBlue invert'
          onClick={(e)=>sendAtestNotify(e, false)}
        >Send Inbox Notification Test to YOURSELF</button>
      <br />
        <button
          className='action clearBlue invert'
          onClick={(e)=>sendAtestNotify(e, true)}
        >Send Inbox Notification Test to ALL USERS</button>
      </form>
      
      
      <hr />
      
      <h2 className='cap'>Email Test</h2>
      <form onSubmit={(e)=>sendTestEmail(e)}>
        <p>
          <label>To email address<br />
            <input
              id='toEmail'
              type='email'
              required
            />
          </label>
        </p>
        <p>
          <button
            className='action clearBlue'
            type='submit'
          >Send Email</button>
        </p>
      </form>
      <hr />
      
    </div>
  );
};

export default NotifySlide;