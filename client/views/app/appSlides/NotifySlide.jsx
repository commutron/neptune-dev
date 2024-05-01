import React from 'react';
// import Pref from '/client/global/pref.js';
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
  
  function handleDevEmail(e, value) {
    e.preventDefault();
    Meteor.call('setDevEmail', value, (error, reply)=>{
      error && console.log(error);
      reply && toast.success('Saved');
    });
  }
  
  function sendTestEmail(e, value) {
    e.preventDefault();
    Meteor.call(
      'sendTestEmail', value, 'TEST - Hello from Neptune!',
      (err)=> {
        err && console.log(err);
        toast('Email Request Sent');
      }
    );
  }
  
  function sendDevStatusEmail() {
    Meteor.call('handleDevMonitorEmail', (err)=> {
      err && console.log(err);
      toast('Email Request Sent');
    });
  }
  
  return(
    <div className='space3v autoFlex'>
      
      <NotifyAction 
        title="Toast Styles"
        sub="available toast notification styles"
        doLabel="Test Toast Notifications"
        func={showToast}
      />
      
      <div>
        <h2 className='cap'>Send a Notification</h2>
        <i>Causes a toast pop and a message in the user's inbox</i>
        <form>
          <input type='text' id='tiTle' />
          <br />
          <textarea id='mesSage'></textarea>
          <br />
          <button
            className='smallAction blueHover'
            onClick={(e)=>sendAtestNotify(e, false)}
          >Send Inbox Notification Test to YOURSELF</button>
        <br />
          <button
            className='smallAction blueHover'
            onClick={(e)=>sendAtestNotify(e, true)}
          >Send Inbox Notification Test to ALL USERS</button>
        </form>
      </div>
      
      <div>
        <h2 className='cap'>NodeMailer Email</h2>
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
        
        <NotifyFormAction
          uniq='gen_email_test'
          title='Any Email Test'
          icon="fa-solid fa-envelope"
          func={sendTestEmail}
          formlabel="Send To email address"
          doLabel="Send Email"
        />
        
      </div>
      
      <div>
        <h2 className='cap'>Dev Email</h2>
        
        <NotifyFormAction
          uniq='dev_email_set'
          title='Dev Email for Error Reports'
          icon="fa-solid fa-terminal"
          func={handleDevEmail}
          formlabel="Developer email address"
          defVal={app.devEmail}
          doLabel="Save Email"
        />
        
        <hr className='vmargin' />
        
        <NotifyAction 
          title=""
          sub=""
          doLabel="Send Dev Satus Email"
          func={sendDevStatusEmail}
        />
        
      </div>
  
    </div>
  );
};

export default NotifySlide;
        
const NotifyAction = ({ title, sub, doLabel, func })=> (
  <div>
    <h3 className='cap'>{title}</h3>
    <i>{sub}</i>
    <p>
      <button
        className='smallAction blueHover'
        onClick={()=>func()}
      >{doLabel}</button>
    </p>
  </div>
);

const NotifyFormAction = ({ uniq, title, icon, formlabel, defVal, doLabel, func })=> (
  <div>
    <h3 className='cap'><i className={`${icon} gapR`}></i>{title}</h3>
    <form onSubmit={(e)=>func(e, this[uniq+'field'].value)}>
      <p>
        <label htmlFor={uniq+'field'}>{formlabel}<br />
          <input
            id={uniq+'field'}
            type='email'
            defaultValue={defVal || ''}
            required
          />
        </label>
      </p>
      <p>
        <button
          className='smallAction blueHover'
          type='submit'
        >{doLabel}</button>
      </p>
    </form>
  </div>
);