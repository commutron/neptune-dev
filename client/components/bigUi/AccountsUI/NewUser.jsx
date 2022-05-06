import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { toast } from 'react-toastify';

import './style';

const NewUser = ({ mxW, pad, bttn })=> {
  
  const [ newUsernameState, newUsernameSet ] = useState( false );
	const [ choicePasswordState, choicePasswordSet ] = useState( false );
	const [ confirmPasswordState, confirmPasswordSet ] = useState( false );
	const [ organizationNameState, organizationNameSet ] = useState( false );
	const [ orgPinState, orgPinSet ] = useState( false );
  
  const [ newUserResultState, newUserResultSet ] = useState( '' );

	function doNew(e) {
	  e.preventDefault();
	  const user = newUsernameState;
	  const passChoice = choicePasswordState;
	  const passConfirm = confirmPasswordState;
	  const orgName = organizationNameState;
	  const orgPIN = orgPinState;
	  
	  if(passChoice === passConfirm) {
	    Meteor.call('verifyOrgJoin', orgName, orgPIN, (error, reply)=>{
	      if(error)
	        console.log(error);
	      if(reply === true) {
	      	newUserResultSet( "" );
	      	let options = {username: user, password: passChoice, org: orgName};
	      	Accounts.createUser(options, (error)=>{
	      		if(error) {
	      			console.log(error);
	      			toast.error('Validation Failed');
	      			newUserResultSet( error.reason );
	      		}else{
	      			toast.success('Everything worked corectly');
	      		}
	      	});
		    }else{
		    	toast.error('Invalid PIN');
		    	newUserResultSet( "Can't find an organization with that PIN" );
		    }
	    });
	  }else{
	    toast.warning("Passwords do not match");
	    newUserResultSet( "The password fields don't match, try typing them in again" );
	  }
	}
	
	
	return(
    <form style={pad} onSubmit={(e)=>doNew(e)}
      autoComplete="off">
      <input type='hidden' value='autocompleteFix' autoComplete='off' />
      <NewInput
        id='newUsername'
        type='text'
        iSty={{ width: '100%' }} 
        lbl='Username'
        onChng={()=>newUsernameSet( newUsername.value )}
        plchldr='username'
        pttrn='[A-Za-z0-9\._-]*'
        mnL='4'
        autoComp="off"
      />
      
      <NewInput
        id='choicePassword'
        type='password'
        iSty={{ width: '100%' }} 
        lbl='New Password'
        onChng={()=>choicePasswordSet( choicePassword.value )}
        plchldr='password'
        pttrn='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
        mnL='6'
        autoComp="new-password"
      />
      
      <NewInput
        id='confirmPassword'
        type='password'
        iSty={{ width: '100%' }} 
        lbl='New Password Again'
        onChng={()=>confirmPasswordSet( confirmPassword.value )}
        plchldr='password'
        pttrn='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
        mnL='6'
        autoComp="new-password"
      />
      
      <NewInput
        id='organizationName'
        type='text'
        iSty={{ width: '100%' }} 
        lbl='Organization'
        onChng={()=>organizationNameSet( organizationName.value )}
        plchldr='organization'
        pttrn='[A-Za-z0-9\._-]*'
        mnL='0'
        autoComp="organization"
      />
  
      <NewInput
        id='orgPin'
        type='password'
        iSty={{ width: '100%' }} 
        lbl='Activation PIN'
        onChng={()=>orgPinSet( orgPin.value )}
        plchldr='PIN'
        pttrn='[0000-9999]*'
        mxL='4'
        mnL='4'
        inputMode='numeric'
        autoComp="new-password"
      />
     
      <p>
        <button
          type='submit'
          id='createSubmit'
          style={bttn}
          className='createButton'
         >Create New User</button>
      </p>
      <p style={mxW} className='centreText'>{newUserResultState}</p>
    </form>
  );
};

export default NewUser;

const NewInput = ({ 
  id, type, iSty, lbl, 
  onChng, plchldr, pttrn, mxL, mnL, inMd, autoComp
})=> (
  <p>
    <label htmlFor={id}>{lbl}</label>
    <br />
    <input
      type={type}
      id={id}
      style={iSty}
      className='showValid'
      onChange={onChng}
      placeholder={plchldr}
      maxLength={mxL || '64'}
      minLength={mnL}
      pattern={pttrn}
      inputMode={inMd || 'text'}
      autoComplete={autoComp}
      required 
    />
  </p>
);