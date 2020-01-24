import React, { useState } from 'react';

const PasswordChange = (props)=> {
	
	const [ choicePassword, choicePasswordSet ] = useState( false );
	const [ confirmPassword, confirmPasswordSet ] = useState( false );
	const [	changeResult, changeResultSet ] = useState( '' );

	function doChange(e) {
	  e.preventDefault();
	  
	  if(choicePassword === confirmPassword) {
	    changeResultSet("");
			Meteor.call('selfPasswordChange', confirmPassword, (error, reply)=>{
				error && console.log(error);
				if(reply) {
					changeResultSet('saved');
				}
			});
	  }else{
	    changeResultSet("the password fields don't match, try typing them in again");
	  }
	}
	
	let sty = {
		maxWidth: '240px'
	};
	
	return(
		<div className='invert'>
      <form 
        onSubmit={(e)=>doChange(e)}>
        <p>
          <label htmlFor='chPass'>New Password</label>
          <br />
          <input
            type='password'
            id='chPass'
            onChange={()=>choicePasswordSet(chPass.value)}
            placeholder='password'
            required
            autoComplete="new-password" />
        </p>
        <p>
          <label htmlFor='coPass'>New Password Again</label>
          <br />
          <input
            type='password'
            id='coPass'
            onChange={()=>confirmPasswordSet(coPass.value)}
            placeholder='password'
            required
            autoComplete="new-password" />
        </p>
        <p>
          <button
            type='submit'
            id='changeSubmit'
            className='action clearGreen'
           >Save New Password</button>
        </p>
        <p style={sty}>{changeResult}</p>
      </form>
    </div>
	);
};

export default PasswordChange;