import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const FoldInNested = ({ seriesId, serial, sKey, step, lock })=> {

  function passNested(e) {
    e.preventDefault();
    this.goNest.disabled = true;
		const subSerial = this.nestSerial.value;
		Meteor.call('addNestedX', seriesId, serial, sKey, step, subSerial, (error, reply)=>{
	    error && console.log(error);
			if(reply) {
			  document.getElementById('lookup').focus();
			  this.nestSerial.value = '';
		  }else{
		    toast.error('Server Error');
		  }
		});
  }
  
  return(
    <div className='stoneFrame fakeFielset teal centre'>
      <br />
      <p className='bigger centreText up'>{step}</p>
  		<br />
	  		<form 
	  			className='centre stoneForm' 
	  			onSubmit={(e)=>passNested(e)}>
			    <input
			      type='text'
			      className='centreText'
			      id='nestSerial'
			      maxLength={10}
	          minLength={8}
	          placeholder='serial number'
	          inputMode='numeric'
	          required />
	        <br />
			    <button
			      type='submit'
					  className='action clearWhite up'
					  name='include this serial number'
					  id='goNest'
					  tabIndex={-1}
					  disabled={lock}
					>{Pref.nest}</button>
				</form>
			<br />
    </div>
  );
};

export default FoldInNested;