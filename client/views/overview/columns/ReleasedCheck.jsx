import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import TrinaryStat from '/client/components/tinyUi/TrinaryStat.jsx';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule.jsx';


const ReleasedCheck = ({ 
  batchID, batchNum, 
  isX, isDone,
  releasedToFloor, releases,
  app, dense, isRO, isDebug
})=> {
  
  if( Array.isArray(releases) ) {
    
    const floorRelease = !releasedToFloor ? false :
      releases.find( x => x.type === 'floorRelease');
    
    return(
      <ReleaseWrapper
        id={batchID}
        batchNum={batchNum}
        releasedBool={releasedToFloor}
        releaseObj={floorRelease}
        actionKeyword='floorRelease'
        actionText='Released'
        holdText={`Released with ${Pref.shortfall}`}
        unholdText={`Released without ${Pref.shortfall}`}
        undoText='Cancel Release'
        contextText='to the floor'
        lockout={isDone || isRO}
        isX={isX}>
        <TrinaryStat
          status={releasedToFloor ? !floorRelease.caution ? true : false : null}
          name='Released'
          title={`Released from ${Pref.kitting}`}
          size=''
          onIcon='fas fa-flag fa-2x greenT'
          midIcon='fas fa-flag fa-2x yellowT'
          offIcon='far fa-flag fa-2x grayT' />
      </ReleaseWrapper>
    );
  }
    
  return(
    <div>
      <i className='fade small label'></i>
    </div>
  );
};

export default ReleasedCheck;