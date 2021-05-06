import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const FoldInNested = ({ 
	seriesId, serial, sKey, step, lockout, topClass, topTitle,
	riverFlowStateSet, closeUndoOption, commTxtState
})=> {
	
	const [ subState, subSet ] = useState(false);
	const [ checkState, checkSet ] = useState(false);
	
  function checkNested(e) {
    e.preventDefault();
    this.goNeck.disabled = true;
		const subSerial = this.nestSerial.value;
		
		Meteor.call('checkNestX', subSerial, (err, re)=>{
	    err && console.log(err);
			if(re) {
				if(re[0] === false && re[1] === true && re[2] === true	
						&& re[3] === false && re[4] === false && re[5] === false
				) {
					passNested(subSerial, re[1], re[2]);
				}else{
					subSet(subSerial);
					checkSet(re);
				}
		  }else{
		    toast.error('Server Error');
		  }
		});
  }
  
  function doNest(e) {
    this.goNest.disabled = true;
		passNested(subState, checkState[1], checkState[2]);
  }
  
  function passNested(subSerial, exists, complete) {
  	riverFlowStateSet( false );
  	closeUndoOption();
  	const comm = commTxtState;
		Meteor.call('addNestedX', seriesId, serial, sKey, step, comm, subSerial, exists, complete,
		(error, reply)=>{
	    error && console.log(error);
			if(reply) {
				riverFlowStateSet( 'slow' );
			  document.getElementById('lookup').focus();
		  }else{
		    toast.error('Server Error');
		  }
		});
  }
  
  function cancelNest() {
  	subSet(false);
  	checkSet(false);
  }
  
  if(!Array.isArray(checkState)) {
  	return(
	    <div className={topClass + ' stoneFrame nestBox teal centre centreText noCopy'} 
	    	title={topTitle}>
	    	<p><i className="fas fa-object-group fa-lg fa-fw"></i> Nest</p>
	      <p className='up wordBr'>{step}</p>
	  		<form 
	  			className='centre stoneForm' 
	  			onSubmit={(e)=>checkNested(e)}>
			    <input
			      type='text'
			      className='centreText'
			      id='nestSerial'
			      pattern='[A-Za-z0-9_-]*'
			      maxLength={32}
	          minLength={6}
	          placeholder='serial number'
	          inputMode='numeric'
	          disabled={lockout}
	          required />
	        <br />
			    <button
			      type='submit'
					  className='roundAction clearWhite up'
					  name='include this serial number'
					  id='goNeck'
					  tabIndex={-1}
					  disabled={lockout}
					>{Pref.nest}</button>
				</form>
    	</div>
    );
  }
    
	return(
    <div className='stoneFrame teal nestBox centre centreText blackblackT'>
    	<p className='whiteT'><i className="fas fa-object-group fa-lg fa-fw"></i> Nest</p>
      <p className='up wordBr whiteT'>{step}</p>
  		{checkState[0] === true ? 
  			<p><n-num>{subState}</n-num> is <b>already</b> nested</p>
  			:
  			checkState[3] === true ? 
  				<p><n-num>{subState}</n-num> has one or more outstanding <b>nonconformaces</b>.</p>
  			:
  			checkState[4] === true ? 
  				<p><n-num>{subState}</n-num> has one or more outstanding <b>shortfalls</b>.</p>
  			:
  			checkState[5] === true ? 
  				<p><n-num>{subState}</n-num> has been <b>scrapped</b>.</p>
  			:
  			<div className='centre centreText'>
  				{checkState[1] === false ? 
  					<p><n-num>{subState}</n-num> is <b>not</b> an internal serial number.</p>
  				:
  				checkState[2] === false &&
  					<p><n-num>{subState}</n-num> is <b>not</b> completed. Nesting now will force finish.</p>
  				}
  				<button
			      type='button'
					  className='roundAction clearWhite up'
					  name={`include ${subState}`}
					  id='goNest'
					  tabIndex={-1}
					  onClick={(e)=>doNest(e)}
					  disabled={!subState}
					>Yes, Do {Pref.nest}</button>
  			</div>
  		}
  		<div className='centre vmarginhalf'>
  			<button
		      type='button'
				  className='miniAction up'
				  name={`include ${subState}`}
				  id='goBack'
				  tabIndex={-1}
				  onClick={(e)=>cancelNest(e)}
				>Cancel</button>
			</div>
    </div>
  );
};

export default FoldInNested;