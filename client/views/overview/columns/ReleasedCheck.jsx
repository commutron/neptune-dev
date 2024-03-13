import React from 'react';
import Pref from '/client/global/pref.js';

import TrinaryStat from '/client/components/tinyUi/TrinaryStat';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule';

const ReleasedCheck = ({ 
  batchID, batchNum, tBatch,
  isDone, releasedToFloor, releases,
  isAuth, isRO
})=> {
  
  if( Array.isArray(releases) ) {
    
    const floorRelease = !releasedToFloor ? false :
      releases.find( x => x.type === 'floorRelease');
    
    const qReady = tBatch.isQuoted;
    
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
        lockout={isDone || isRO || (!releasedToFloor && !qReady)}
        qReady={qReady}
        isAuth={isAuth}>
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