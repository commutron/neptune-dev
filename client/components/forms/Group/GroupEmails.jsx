import React , { useState } from 'react';
import { toast } from 'react-toastify';

import ModelSmall from '/client/components/smallUi/ModelSmall';

const GroupEmailsManager = ({ groupData })=> {

  const access = Roles.userIsInRole(Meteor.userId(), 'edit');
  
  return(
    <ModelSmall
      button='Set Emails'
      title='Email Configuration' 
      color='grayT'
      icon='fa-at'
      lock={!access}
      primeTopRight={true}>
      <GroupEmails
        groupData={groupData}
      />
    </ModelSmall>
  );
};

export default GroupEmailsManager;

const GroupEmails = ({ groupData })=> (
  <div className='centre vmarginhalf space'>
  
    <EmailSendToggle
      gId={groupData._id}
      emailset={groupData.emailOptIn}
      lockOut={groupData.hibernate} 
    />
    
    <EmailPrimeForm 
      gId={groupData._id}
      emailset={groupData.emailPrime}
      lockOut={groupData.hibernate} 
    />
    
    <EmailSecondForm 
      gId={groupData._id}
      emailset={groupData.emailSecond}
      lockOut={!groupData.emailPrime} 
    />

  </div>
);

const EmailPrimeForm = ({ gId, emailset, lockOut })=> {
  
	const [ emailOneChoice, emailOneChoiceSet ] = useState( emailset );
  
  function addPrimeEmail(e) {
    e.preventDefault(e);
    if(emailOneChoice) {
      Meteor.call('groupPrimeEmailSet', gId, emailOneChoice, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        reply && toast.success('Primary Email Saved');
      });
    }else if(emailOneChoice === '') {
      Meteor.call('groupPrimeEmailRemove', gId, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        reply && toast.success('Primary Email Removed');
      });
    }else{
      null;
    }
  }
  
  return(
    <form onSubmit={(e)=>addPrimeEmail(e)}>
      <p>
        <label><b>Primary Email Address</b></label><br />
        <input
          type='email'
          id='gprimeEmailVal'
          defaultValue={emailset || ''}
          onChange={()=>emailOneChoiceSet(gprimeEmailVal.value)}
          placeholder={emailset || ''}
          autoComplete="false"
          style={{borderBottomStyle: 'solid'}}
        />
      
        <button
          type='submit'
          id='changeGrpEmailSubmit'
          className='smallAction nHover'
         >Change</button>
      </p>
    </form>
  );
};

const EmailSecondForm = ({ gId, emailset, lockOut })=> {
  
	const [ emailTwoChoice, emailTwoChoiceSet ] = useState( null );
  
  function addSecEmail(e) {
    e.preventDefault(e);
    if(emailTwoChoice) {
      Meteor.call('groupSecondEmailSet', gId, emailTwoChoice, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        reply && toast.success('Saved New Email');
        this.gEmailTwoVal.value = '';
      });
    }
  }
  
  function secRemove(address) {
    Meteor.call('groupSecondEmailCut', gId, address, (error, reply)=>{
      error && console.log(error);
      reply ? toast.success('Removed') : toast.warning('Cannot be removed');
    });
  }
    
  
  return(
    <div>
      <form onSubmit={(e)=>addSecEmail(e)}>
        <p>
          <label>Secondary Email Addresses <em>(limit of 5)</em></label><br />
          <input
            type='email'
            id='gEmailTwoVal'
            onChange={()=>emailTwoChoiceSet(gEmailTwoVal.value)}
            required
            autoComplete="false"
            disabled={emailset && emailset.length >= 5 || lockOut}
          />
        
          <button
            type='submit'
            id='addGrpEmailSubmit'
            className='smallAction nHover'
            disabled={emailset && emailset.length >= 5 || lockOut}
           >Add New</button>
        </p>
      </form>
      
      <dl>
        {emailset && emailset.map( (entry, index)=>{
          return( 
            <dt key={index} className='comfort bottomLine'>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={()=>secRemove(entry)}
              ><i className='fas fa-times fa-fw'></i> remove</button>
            </dt>
        )})}
      </dl>
    
    </div>
  );
};

const EmailSendToggle = ({ gId, emailset, lockOut })=> {
  
  function doGroupEmail(val) {
    Meteor.call('groupEmailOptIn', gId, val, (error, reply)=>{
      error && console.log(error);
      reply && toast.success('Saved');
    });
  }
  
  return(
    <div>
      <p className='beside'>
        <input
          type='checkbox'
          id='gEmailDo'
          className=''
          defaultChecked={emailset}
          onChange={()=>doGroupEmail(!emailset)}
          required
        />
        <label htmlFor='gEmailDo'>Send Automated Emails</label>
      </p>
    </div>
  );
};