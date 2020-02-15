import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
// import PrioritySquareData from '/client/components/bigUi/PrioritySquare.jsx';
// import { PrioritySquare } from '/client/components/bigUi/PrioritySquare.jsx';
import TrinaryStat from '/client/components/uUi/TrinaryStat.jsx';
import { FloorReleaseWrapper } from '/client/components/bigUi/ReleasesModule.jsx';


const KittingChecks = ({ 
  batchID, batchNum, 
  isX, isDone,
  releasedToFloor, floorRelease,
  clientTZ, pCache, app, 
  kitCols, dense, isRO
})=> {
  
  const [ stData, setStatus ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('overviewKittingStatus', batchID, clientTZ, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setStatus( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(stData);
      }
    });
  }, [batchID]);
  
  const dt = stData;
  // const pt = pCache.dataSet.find( x => x.batchID === batchID );
   
  if( dt && dt.batchID === batchID ) {
    
    
    return(
      <Fragment>

        <div>
          <NumStat
            num={ '--' }
            name={'-'}
            title=''
            color={'darkgrayT'}
            size='big' />
        </div>
        
        <div>
          <NumStat
            num={ '--' }
            name={'-'}
            title=''
            color={'darkgrayT'}
            size='big' />
        </div>
        
        <div>
          <NumStat
            num={ '--' }
            name={'-'}
            title=''
            color={'darkgrayT'}
            size='big' />
        </div>
        
        <div>
          <TrinaryStat
            status={dt.riverChosen}
            name='Flow'
            title='Has had a Process Flow assigned'
            size=''
            onIcon='far fa-check-circle fa-2x' 
            offIcon='far fa-times-circle fa-2x' />
        </div>
        
        <FloorReleaseWrapper
          id={batchID}
          batchNum={batchNum}
          releasedBool={releasedToFloor}
          releaseObj={floorRelease}
          lockout={isDone || isRO}
          isX={isX}>
          <TrinaryStat
            status={releasedToFloor ? !floorRelease.caution ? true : false : null}
            name='Released'
            title={`Has been released from ${Pref.kitting}`}
            size=''
            onIcon='fas fa-flag fa-2x'
            offIcon='far fa-flag fa-2x' />
        </FloorReleaseWrapper>
        
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {kitCols.map( (st, index)=>{
        return(
          <div key={batchID + st + index + 'x'}>
            <i className='fade small label'>{st}</i>
          </div>
      )})}
    </Fragment>
  );
};

export default KittingChecks;