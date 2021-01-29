import React from 'react';
//import Pref from '/client/global/pref.js';

import TimeBudgetsChunk from './TimeBudgetsChunk.jsx';
import TimeBlocksRaw from './TimeBlocksRaw.jsx';

const TimeTab = ({
  a, b,
  user, isDebug,
  totalUnits,
  done, allDone,
  riverFlow, riverAltFlow
}) =>	{

  // const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
  // const pSup = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  return(
    <div className='space3v'>
    
      <TimeBudgetsChunk
        a={a}
        b={b}
        totalUnits={totalUnits}
        isDebug={isDebug} />
      
      <div className='vmargin space'>
        <TimeBlocksRaw 
          batch={b.batch} 
          tide={b.tide} 
          lockOut={b.lock}
          isDebug={isDebug} />
      </div>
              
    </div>  
  );
};

export default TimeTab;