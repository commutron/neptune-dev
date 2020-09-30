import React, { useEffect } from 'react';

import { ScanListenerUtility, ScanListenerOff } from '/client/utility/ScanListener.js';

import WikiFrame from './WikiFrame';

const WikiOps = ({ wi, root, anchor, full })=> {
  
  useEffect( ()=> {
    if(Meteor.user()) {
      ScanListenerUtility(Meteor.user());
    }
    return ScanListenerOff();
  }, []);
  
  const address = !wi || wi === 'home' || wi === 'none' ?
                    root : wi;
  
  // console.log(anchor);
  const noA = !Meteor.user().scrollInstruct || !anchor || anchor === "";
  const goString = noA ? address : `${address}?m=${anchor}#${anchor}`;
  // const goString = address;
  
  return(
    <WikiFrame go={goString} full={full} anchor={anchor} />
  );
};

export default WikiOps;