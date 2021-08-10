import React from 'react';
import Pref from '/client/global/pref.js';

import TrinaryStat from '/client/components/tinyUi/TrinaryStat';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule';


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
        actionText='Release'
        holdText={`Released with ${Pref.shortfall}`}
        unholdText={`Released without ${Pref.shortfall}`}
        undoText='Cancel Release'
        contextText='to the floor'
        lockout={isDone || isRO}
        isX={isX}>
        <TrinaryStat
          status={releasedToFloor ? !floorRelease.caution ? true : false : null}
          name={Pref.kitting}
          title='Released from'
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