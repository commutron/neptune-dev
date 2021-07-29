import React, { useState, useEffect } from 'react';

import { SigninListenerUtility, SigninListenerOff } from '/client/utility/SigninListener';

import './style.css';

const ScanUI = ({ sty })=> {
	
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
        <i className="fas fa-sun fa-stack-2x colorShift"></i>
        <i className="fas fa-user-astronaut fa-stack-1x darkT" 
           data-fa-transform='shrink-5 flip-h'
        ></i>
      </span>
		}
		  <p style={sty} className='centreText'>{Session.get('signinError')}</p>
    </div>
	);
};

export default ScanUI;