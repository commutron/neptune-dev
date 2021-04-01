import React, { useState, useEffect } from 'react';

import { SigninListenerUtility, SigninListenerOff } from '/client/utility/SigninListener';

import './style.css';

const ScanUI = ({ listenSet })=> {
	
	const [ loginState, loginSet ] = useState( false );

	useEffect( ()=> {
    SigninListenerUtility(loginSet);
    return ()=>{ SigninListenerOff() };
  }, []);

		
	return(
		<div className={`centre`}>
      <span className={`fa-stack fa-6x scanInIndicator ${loginState ? 'spinOut':''}`}>
        <i className="fas fa-sun fa-stack-2x colorShift"></i>
        <i className="fas fa-user-astronaut fa-stack-1x darkT" 
           data-fa-transform='shrink-5 flip-h'
        ></i>
      </span>
    </div>
	);
};

export default ScanUI;