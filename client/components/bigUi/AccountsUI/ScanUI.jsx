import React, { useState, useEffect } from 'react';

import { SigninListenerUtility, SigninListenerOff } from '/client/utility/SigninListener';

import './style.css';

const ScanUI = ({ mxW })=> {
	
	const [ loginState, loginSet ] = useState( false );
  
	useEffect( ()=> {
	  Session.set('signinError', '');
    SigninListenerUtility(loginSet);
    return ()=>{ SigninListenerOff() };
  }, []);

	return(
		<div className='scanIn centre'>
		{/iPod|iPhone|iPad/.test(navigator.platform) ? null :
      <span className={`fa-stack fa-6x scanInIndicator ${loginState ? 'spinOut' : ''}`}>
        <i className="fa-solid fa-certificate fa-stack-2x fa-width-auto colorShift"></i>
        <i className="fa-solid fa-user-astronaut fa-stack-1x darkT" data-fa-transform='flip-h'></i>
      </span>
		}
		  <p style={mxW} className='centreText'>{Session.get('signinError')}</p>
    </div>
	);
};

export default ScanUI;