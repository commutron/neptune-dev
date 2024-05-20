import React from 'react';

const ButtonRedo = ({ act, ky, step, func, lockout })=> {
	if(act === 'okay') {
		return(
			<button
				className='reInspect'
				name={step}
				id={ky+'redook'}
				onClick={func}
				disabled={lockout}
				><label htmlFor={ky+'redook'}>OK</label>
			</button>
		);
	}
	if(act === 'pass') {
		return(
			<button
			  className='reTest'
				name={'Pass '+ step}
				id={ky+'redopass'}
				onClick={func}
				disabled={lockout}
				><label htmlFor={ky+'redopass'}>Pass</label>
			</button>
		);
	}
	if(act === 'fail') {
		return(
			<button
			  className='reFail'
				name={'Fail '+ step}
				id={ky+'redofail'}
				onClick={func}
				disabled={lockout}
				><label htmlFor={ky+'redofail'}>Fail</label>
			</button>
		);
	}
	if(act === 'bypass') {
		return(
			<button
			  className='reBy'
				name={'Bypass '+ step}
				id={ky+'redobypass'}
				onClick={func}
				disabled={lockout}
				><label htmlFor={ky+'redobypass'}>Bypass</label>
			</button>
		);
	}
	return(
		<button
		  className='reFail'
			name={step + ' fail'}
			id={ky+'redong'}
			onClick={func}
			disabled={lockout}
			><label htmlFor={ky+'redong'}>NG</label>
		</button>
	);
};

export default ButtonRedo;