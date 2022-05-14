import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PasswordChange = (props)=> {
	
	const [ nowPassword, nowPasswordSet ] = useState( false );
	const [ choicePassword, choicePasswordSet ] = useState( false );
	const [ confirmPassword, confirmPasswordSet ] = useState( false );

	function doChange(e) {
	  e.preventDefault();
	  
	  if(choicePassword === confirmPassword) {
	    Accounts.changePassword(nowPassword, confirmPassword, (error)=>{
	      if(error !== undefined) {
	        toast.error( error.reason );
	      }else{
	        toast.success('New Password Saved');
	      }
	    });
	  }else{
	    toast.warning("Password fields do not match. Try again");
	  }
	}
	
	return(
		<div>
      <form 
        onSubmit={(e)=>doChange(e)}>
        
        <div className='bigInfoBox' 
          data-describe='If you have forgotten your current password, contact an administrator.'>
          <div><label htmlFor='nowPassPass'>Current Password</label></div>
          <div>
            <input
              type='password'
              id='nowPassPass'
              onChange={()=>nowPasswordSet(nowPassPass.value)}
              required
              autoComplete="password" 
            />
          </div>
        </div>
        <div className='bigInfoBox' 
          data-describe='Letters, numbers, uppercase, lowercase and the symbols . ! @ # $ % ^ & * ( ) _ - , ? ` < > \ { } ~ = / are all acceptable; a minimum of 6 characters are required.'>
          <div><label htmlFor='chPass'>New Password</label></div>
          <div>
            <input
              type='password'
              id='chPass'
              className='showValid'
              onChange={()=>choicePasswordSet(chPass.value)}
              pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
  	          minLength='6'
              required
              autoComplete="new-password" 
            />
          </div>
        </div>
        <div className='bigInfoBox no'>
          <div><label htmlFor='coPass'>New Password Again</label></div>
          <div>
            <input
              type='password'
              id='coPass'
              className='showValid'
              onChange={()=>confirmPasswordSet(coPass.value)}
              pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
              required
              autoComplete="new-password" 
            />
          </div>
        </div>
    
        <p className='rightRow'>
          <button
            type='submit'
            id='changePassSubmit'
            className='action nSolid'
           >Save New Password</button>
        </p>
      </form>
    </div>
	);
};

export default PasswordChange;