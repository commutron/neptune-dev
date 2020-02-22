import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
// import PrioritySquareData from '/client/components/bigUi/PrioritySquare.jsx';
// import { PrioritySquare } from '/client/components/bigUi/PrioritySquare.jsx';
import TrinaryStat from '/client/components/uUi/TrinaryStat.jsx';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule.jsx';


const KittingChecks = ({ 
  batchID, batchNum, 
  isX, isDone,
  releasedToFloor, releases,
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
    
  if( dt && dt.batchID === batchID && Array.isArray(releases) ) {
    
    const floorRelease = !releasedToFloor ? false :
      releases.find( x => x.type === 'floorRelease');
    
    return(
      <Fragment>
        
        {Pref.clearencesArray.map( (ent, ix)=>{
          const releasedBool = releases.findIndex( x => x.type === ent.keyword) >= 0;
          const releaseObj = releases.find( x => x.type === ent.keyword);
          return(
            <ReleaseWrapper
              key={batchID+ent.keyword+ix}
              id={batchID}
              batchNum={batchNum}
              releasedBool={releasedBool}
              releaseObj={releaseObj}
              actionKeyword={ent.keyword}
              actionText={ent.pre}
              contextText={`${ent.link} ${ent.context}`}
              lockout={isDone || isRO}
              isX={isX}>
              <TrinaryStat
                status={releasedBool ? !releaseObj.caution ? true : false : null}
                name={ent.context}
                title={`Has been ${ent.post} ${ent.link} ${ent.context}`}
                size=''
                onIcon='fas fa-check-square fa-2x'
                offIcon='far fa-check-square fa-2x' 
              />
            </ReleaseWrapper>
        )})}
        
        <div>
          <TrinaryStat
            status={dt.riverChosen}
            name='Flow'
            title='Has had a Process Flow assigned'
            size=''
            onIcon='far fa-check-circle fa-2x' 
            offIcon='far fa-times-circle fa-2x' />
        </div>
        
        <ReleaseWrapper
          id={batchID}
          batchNum={batchNum}
          releasedBool={releasedToFloor}
          releaseObj={floorRelease}
          actionKeyword='floorRelease'
          actionText='release'
          contextText='to the floor'
          lockout={isDone || isRO}
          isX={isX}>
          <TrinaryStat
            status={releasedToFloor ? !floorRelease.caution ? true : false : null}
            name='Released'
            title={`Has been released from ${Pref.kitting}`}
            size=''
            onIcon='fas fa-flag fa-2x'
            offIcon='far fa-flag fa-2x' />
        </ReleaseWrapper>
        
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