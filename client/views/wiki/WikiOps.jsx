import React, { useEffect } from 'react';

// import { ScanListenerUtility, ScanListenerOff } from '/client/utility/ScanListener.js';

import WikiFrame from './WikiFrame';

const WikiOps = ({ root, anchor, full })=> {
  
  // useEffect( ()=> {
  //   if(Meteor.user()) {
  //     ScanListenerUtility(Meteor.user());
  //   }
  //   return ()=> ScanListenerOff();
  // }, []);
  
  const address = Session.equals('nowInstruct', undefined) || 
                  Session.equals('nowInstruct', 'home') || 
                  Session.equals('nowInstruct', 'none' ) ?
                    root : Session.get('nowInstruct');
  
  const noA = !Meteor.user().scrollInstruct || !anchor || anchor === "";
  const goString = noA ? address : `${address}?m=${anchor}#${anchor}`;
  
  return(
    <WikiFrame go={goString} full={full} anchor={anchor} />
  );
};

export default WikiOps;