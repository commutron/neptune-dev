import React from 'react';
import { ToastContainer } from 'react-toastify';

import AccountsUI from '/client/components/bigUi/AccountsUI.jsx';

const Login = ()=> {
  return(
    <div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        newestOnTop />
      <div className='centre'>
        <br />
        <br />
          <AccountsUI />
        <br />
      </div>      
    </div>
  );
};

export default Login;