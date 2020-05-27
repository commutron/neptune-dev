import React from 'react';

import WikiFrame from './WikiFrame';

const WikiOps = ({ wi, root, anchor, full })=> {
  
  const address = !wi || wi === 'home' || wi === 'none' ?
                    root : wi;
  
  // const goString = !anchor || anchor === "" ? 
  //                   address : `${address}#${anchor}`;
  const goString = address;
  
  return(
    <WikiFrame go={goString} full={full} anchor={anchor} />
  );
};

export default WikiOps;