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
		<div className=''>
		  

        <div>
        	<div className={loginState ? 'redT' : 'whiteT'}>
            
        	
        	</div>
        	
        </div>
    
    </div>
	);
};

export default ScanUI;