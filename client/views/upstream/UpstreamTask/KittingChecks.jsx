import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
// import NumStat from '/client/components/tinyUi/NumStat.jsx';
// import PrioritySquareData from '/client/components/bigUi/PrioritySquare.jsx';
// import { PrioritySquare } from '/client/components/bigUi/PrioritySquare.jsx';
import TrinaryStat from '/client/components/tinyUi/TrinaryStat.jsx';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule.jsx';


const KittingChecks = ({ 
  batchID, batchNum, 
  isX, isDone,
  releasedToFloor, releases,
  clientTZ, pCache, app, branchClear, 
  kitCols, dense, isRO, isDebug
})=> {

  // const pt = pCache.dataSet.find( x => x.batchID === batchID );
    
  if( Array.isArray(releases) ) {
    
    const floorRelease = !releasedToFloor ? false :
      releases.find( x => x.type === 'floorRelease');
    
    return(
      <Fragment>
        
        {branchClear.map( (br, ix)=>{
          const releasedBool = releases.findIndex( x => x.type === 'BRK'+br.brKey) >= 0;
          const releaseObj = releases.find( x => x.type === 'BRK'+br.brKey);
          return(
            <ReleaseWrapper
              key={batchID+'BRK'+br.brKey+ix}
              id={batchID}
              batchNum={batchNum}
              releasedBool={releasedBool}
              releaseObj={releaseObj}
              actionKeyword={'BRK'+br.brKey}
              actionText='Ready'
              holdText={`Mark with ${Pref.shortfall}`}
              unholdText={`Ready without ${Pref.shortfall}`}
              undoText='Clear'
              contextText={`for ${br.common}`}
              lockout={isDone || isRO}
              isX={isX}>
              <TrinaryStat
                status={releasedBool ? !releaseObj.caution ? true : false : null}
                name={br.common}
                title={`Ready for ${br.common}`}
                size=''
                onIcon='fas fa-check-square fa-2x greenT'
                midIcon='far fa-minus-square fa-2x yellowT'
                offIcon='far fa-check-square fa-2x grayT' 
              />
            </ReleaseWrapper>
        )})}
        
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
              holdText={`Mark with ${Pref.shortfall}`}
              unholdText={`${ent.pre} without ${Pref.shortfall}`}
              undoText='Clear'
              contextText={`${ent.link} ${ent.context}`}
              lockout={isDone || isRO}
              isX={isX}>
              <TrinaryStat
                status={releasedBool ? !releaseObj.caution ? true : false : null}
                name={ent.context}
                title={`${ent.post} ${ent.link} ${ent.context}`}
                size=''
                onIcon='fas fa-check-square fa-2x greenT'
                midIcon='far fa-minus-square fa-2x yellowT'
                offIcon='far fa-check-square fa-2x grayT' 
              />
            </ReleaseWrapper>
        )})}
        
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