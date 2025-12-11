import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';

import TrinaryStat from '/client/components/tinyUi/TrinaryStat';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule';


const KittingChecks = ({ 
  batchID, batchNum, tBatch,
  isDone, releasedToFloor, releases,
  branchClear, 
  kitCols, isAuth, isRO
})=> {
     
  if( Array.isArray(releases) ) {
    
    const floorRelease = !releasedToFloor ? false :
      releases.find( x => x.type === 'floorRelease');
    
    const serialRelease = releases.find( x => x.type === 'pcbKitRelease');
    
    const qReady = tBatch.isQuoted;
    
    return(
      <Fragment>
        
        <div>
          <TrinaryStat
            status={tBatch.serialize}
            name=''
            title={tBatch.serialize ? 'Serialized' : 'Not Serialized'}
            size=''
            onIcon='fa-solid fa-layer-group fa-2x greenT'
            midIcon='fa-solid fa-cubes-stacked fa-2x darkgrayT' 
            offIcon='fa-solid fa-cubes-stacked fa-2x darkgrayT' 
          />
        </div>
        
        <div>
          <TrinaryStat
            status={qReady}
            name='Quote Time Budget'
            title={qReady ? 'Entered' : 'No'}
            size=''
            onIcon='fa-solid fa-hourglass-start fa-2x greenT'
            midIcon='fa-solid fa-hourglass-empty fa-2x darkgrayT' 
            offIcon='fa-regular fa-hourglass-empty fa-2x darkgrayT' 
          />
        </div>
            
        {branchClear.map( (br, ix)=>{
          const bstep = tBatch.branchCondition.find( bc => bc.brKey === br.brKey );
          if(!bstep.condition) {
            return(
              <div title={`${br.common} N/A`} key={'skipBRK'+br.brKey+ix}>
              <div className='infoSquareOuter noCopy'>
                <i className='fas fa-minus fa-2x fa-fw darkgrayT fade'></i>
                <i className='label infoSquareLabel'></i>
              </div>
            </div>
            );
          }else{
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
                unholdText={`Ready ${br.common}`}
                undoText='Clear'
                contextText={`for ${br.common}`}
                lockout={isDone || isRO}
                isAuth={isAuth}>
                <TrinaryStat
                  status={releasedBool ? !releaseObj.caution ? true : false : null}
                  name={br.common}
                  title='Ready for'
                  size=''
                  onIcon='fas fa-check-square fa-2x greenT'
                  midIcon='far fa-minus-square fa-2x yellowT'
                  offIcon='far fa-check-square fa-2x darkgrayT' 
                />
              </ReleaseWrapper>
            );
          }
        })}
        
        {!tBatch.serialize ?
          <div title={`${Pref.baseSerialPart}s N/A`}>
            <div className='infoSquareOuter noCopy'>
              <i className='fas fa-minus fa-2x fa-fw darkgrayT fade'></i>
              <i className='label infoSquareLabel'></i>
            </div>
          </div>
        :
          <ReleaseWrapper
            key={batchID+'pcbKitRelease'}
            id={batchID}
            batchNum={batchNum}
            releasedBool={!serialRelease ? false : true}
            releaseObj={serialRelease}
            actionKeyword='pcbKitRelease'
            actionText='Ready'
            holdText={`Mark with ${Pref.shortfall}`}
            unholdText={`Ready without ${Pref.shortfall}`}
            undoText='Clear'
            contextText={`${Pref.baseSerialPart}s`}
            lockout={isDone || isRO}
            isAuth={isAuth}>
            <TrinaryStat
              status={!serialRelease ? null : !serialRelease.caution ? true : false}
              name={`${Pref.baseSerialPart}s`}
              title='Ready'
              size=''
              onIcon='fas fa-check-square fa-2x greenT'
              midIcon='far fa-minus-square fa-2x yellowT'
              offIcon='far fa-check-square fa-2x darkgrayT' 
            />
          </ReleaseWrapper>
        }
        
        <ReleaseWrapper
          key={batchID+'proFloorRelease'}
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
          qtReady={qReady || !tBatch.serialize}
          isAuth={isAuth}>
          <TrinaryStat
            status={releasedToFloor ? !floorRelease.caution ? true : false : null}
            name={Pref.kitting}
            title='Released from'
            size=''
            onIcon='fas fa-flag fa-2x greenT'
            midIcon='fas fa-flag fa-2x yellowT'
            offIcon='far fa-flag fa-2x darkgrayT' />
        </ReleaseWrapper>
        
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {kitCols.map( (st, index)=>{
        return(
          <div key={batchID + st + index + 'x'} title={st}>
            <i className='fade small label'>{st}</i>
          </div>
      )})}
    </Fragment>
  );
};

export default KittingChecks;