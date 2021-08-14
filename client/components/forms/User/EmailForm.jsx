import React , { useState }from 'react';
import { toast } from 'react-toastify';

const EmailForm = ({ user })=> {
  
  const emailset = user.emails && user.emails.length > 0;
  const oneemail = emailset ? user.emails[0].address : null;
  
  return(
    <div>
    {!emailset ?
      <EmailNewForm user={user} />
      :
      <EmailRemoveForm emailaddress={oneemail} />
    }
    </div>
  );
};

export default EmailForm;


const EmailNewForm = ({ user })=> {
  
  const [ emailpassState, emailpassSet ] = useState( null );
	const [ emailChoice, emailChoiceSet ] = useState( null );
  
  function addEmail(e) {
    e.preventDefault(e);
    if(emailpassState && emailChoice) {
      Meteor.call('userEmailSet', emailpassState, emailChoice, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        reply && toast.success('Saved New Email');
      });
    }
  }
  
  return(
    <div>
      <form onSubmit={(e)=>addEmail(e)}>
        <div className='bigInfoBox no'>
          <div><label htmlFor='uEmailnowPassNew'>Current Password</label></div>
          <div>
            <input
              type='password'
              id='uEmailnowPassNew'
              onChange={()=>emailpassSet(uEmailnowPassNew.value)}
              defaultValue={emailpassState}
              autoComplete="new-password" 
              required
            />
          </div>
        </div>
        
        <div className='bigInfoBox no'> 
          <div><label htmlFor='uEmailVal'>New Email Address</label></div>
          <div>
            <input
              type='email'
              id='uEmailVal'
              className='showValid'
              minLength='4'
              onChange={()=>emailChoiceSet(uEmailVal.value)}
              placeholder={'@'+user.org+'.ca'}
              required
              autoComplete="false" 
            />
          </div>
        </div>
        
        <p className='rightRow'>
          <button
            type='submit'
            id='changeUsrEmailSubmit'
            className='action clearBlue'
           >Save New Email Address</button>
        </p>
      </form>
    </div>
  );
};

const EmailRemoveForm = ({ emailaddress })=> {
  
	const [ eremovepassState, eremovepassSet ] = useState( null );
  
  function removeEmail(e) {
    e.preventDefault(e);
    if(eremovepassState && emailaddress) {
      Meteor.call('userEmailRemove', eremovepassState, emailaddress,
      (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        reply && toast.success('Email removed');
      });
    }
  }
  
  return(
    <div>
      <form onSubmit={(e)=>removeEmail(e)}>
        <div className='bigInfoBox no'> 
          <div><label htmlFor='uEmailnowPassDelete'>Current Password</label></div>
          <div>
            <input
              type='password'
              id='uEmailnowPassDelete'
              onChange={()=>eremovepassSet(uEmailnowPassDelete.value)}
              defaultValue={eremovepassState}
              autoComplete="new-password" 
              required
            />
          </div>
        </div>
        
        <div className='bigInfoBox no'> 
          <div><label>Current Email Address</label></div>
          <div className='clean'>{emailaddress}</div>
        </div>
          
        <p className='rightRow'>
          <button
            type='submit'
            id='uEmailDelete'
            className='action clearRed'
          >Remove Email Address</button>
        </p>
      </form>
    </div>
  );
};