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
        <p>
          <label htmlFor='chPass'>Current Password<br />
            <input
              type='password'
              id='nowPassPass'
              onChange={()=>nowPasswordSet(nowPassPass.value)}
              required
              autoComplete="password" 
          /></label>
        </p>
        <p>
          <label htmlFor='chPass'>New Password<br />
          <input
            type='password'
            id='chPass'
            className='showValid'
            onChange={()=>choicePasswordSet(chPass.value)}
            pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
	          minLength='6'
            required
            autoComplete="new-password" 
          /></label>
          <br />
          <label htmlFor='coPass'>New Password Again<br />
          <input
            type='password'
            id='coPass'
            className='showValid'
            onChange={()=>confirmPasswordSet(coPass.value)}
            pattern='[A-Za-z0-9\.!@#$%^&*()_\-,?`<>[\]{}~=/\\]*'
            required
            autoComplete="new-password" /></label>
        </p>
        <p>
          <button
            type='submit'
            id='changePassSubmit'
            className='action clearBlue'
           >Save New Password</button>
        </p>
      </form>
    </div>
	);
};

export default PasswordChange;