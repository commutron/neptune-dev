import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const NotifySlide = ({ app })=> {
  
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
  
  function handleAppEmail(val) {
    Meteor.call('setEmailGlobal', val, (error, reply)=>{
      error && console.log(error);
      reply && toast.success('Saved');
    });
  }
  
  function handleBCCEmail(e) {
    e.preventDefault();
    const val = this.toEmailBCC.value;
    
    Meteor.call('setEmailBCC', val, (error, reply)=>{
      error && console.log(error);
      reply && toast.success('Saved');
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
    <div className='space3v autoFlex'>
      
      <div>
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
      </div>
      
      <div>
        <h2 className='cap'>Notification Styles:</h2>
        <i>available toast notification styles</i>
        <p>
          <button
            className='action clearBlue invert'
            onClick={()=>showToast()}
          >Test Toast Notifications</button>
        </p>
      </div>
      
      <div>
        <h2 className='cap'>Neptune Email</h2>
        <p><em>Requires enviroment variable "Mail_URL"</em></p>
        <p className='beside'>
          <input
            type='checkbox'
            id='appEmailDo'
            className='medBig'
            defaultChecked={app.emailGlobal}
            onChange={()=>handleAppEmail(!app.emailGlobal)}
            required
          />
          <label htmlFor='appEmailDo'>Enable Email</label>
        </p>
        
        <hr className='vmargin' />
        
        <h3 className='cap'>Email BCC Address</h3>
        <form onSubmit={(e)=>handleBCCEmail(e)}>
          <p>
            <label htmlFor='toEmailBCC'>BCC Email Address<br />
              <input
                id='toEmailBCC'
                type='email'
                required
              />
            </label>
          </p>
          <p className='small'
            >If set, all external emails will be Blind-Carbon-Copy to this address.
          </p>
          <p>
            <button
              className='action clearBlue'
              type='submit'
            >Set Address</button>
          </p>
        </form>
        
        <hr className='vmargin' />
        
        <h3 className='cap'>Email Test</h3>
        <form onSubmit={(e)=>sendTestEmail(e)}>
          <p>
            <label htmlFor='toEmail'>To email address<br />
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
      </div>
      
    </div>
  );
};

export default NotifySlide;