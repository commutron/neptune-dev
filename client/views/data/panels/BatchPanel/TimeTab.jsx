import React from 'react';
//import Pref from '/client/global/pref.js';

import TimeBudgetsChunk from '/client/views/data/panels/XBatchPanel/TimeBudgetsChunk';

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
        tideWall={a.tideWall}
        b={b}
        totalUnits={totalUnits}
        isDebug={isDebug} />
              
    </div>  
  );
};

export default TimeTab;