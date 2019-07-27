import React from 'react';

import WikiFrame from './WikiFrame';

const WikiOps = ({ wi, root, anchor, full })=> {
  
  //console.log(anchor);
  
  let goto = wi;
  
  !goto || goto === 'home' || goto === 'none' ? goto = root : null;
  //anchor ? goto = goto + '#' + anchor : null;

  return(
    <WikiFrame go={goto} full={full} />
  );
};

export default WikiOps;