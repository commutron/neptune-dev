import React from 'react';

const Freeze = ({ children })=>	(
  <div className='ice'>
    <div className='space centre'>
      {children}
    </div>
  </div>
);

export default Freeze;