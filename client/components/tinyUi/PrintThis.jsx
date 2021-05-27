import React from 'react';

const PrintThis = ()=> (
  <button
    title="Print Page"
    className='smallAction blackT centreSelf noPrint'
    onClick={()=> window.print()}
  ><small>Print Friendly</small><i className='fas fa-print gapL'></i>
  </button>
);

export default PrintThis;