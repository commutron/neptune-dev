import React, { Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import TrinaryStat from '/client/components/tinyUi/TrinaryStat';
import { ReleaseWrapper } from '/client/components/bigUi/ReleasesModule';


const KittingChecks = ({ 
  batchID, batchNum, tBatch,
  isDone, releasedToFloor, releases,
  app, branchClear, 
  kitCols, dense, isDebug
})=> {
  
  const isRO = Roles.userIsInRole(Meteor.userId(), 'readOnly');

  if( Array.isArray(releases) ) {
    
    const floorRelease = !releasedToFloor ? false :
      releases.find( x => x.type === 'floorRelease');
    
    const serialRelease = releases.find( x => x.type === 'pcbKitRelease');
          
    return(
      <Fragment>
        
        {branchClear.map( (br, ix)=>{
          const bstep = tBatch.branchCondition.find( bc => bc.brKey === br.brKey );
          if(!bstep.condition) {
            return(
              <div title='N/A' key={'skipBRK'+br.brKey+ix}>
              <div className='infoSquareOuter noCopy'>
                <i className='fas fa-minus fa-2x fa-fw darkgrayT fade'></i>
                <br />
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
                unholdText={`Ready without ${Pref.shortfall}`}
                undoText='Clear'
                contextText={`for ${br.common}`}
                lockout={isDone || isRO}>
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
          <div title='N/A'>
            <div className='infoSquareOuter noCopy'>
              <i className='fas fa-minus fa-2x fa-fw darkgrayT fade'></i>
              <br />
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
            lockout={isDone || isRO}>
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
          lockout={isDone || isRO}>
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
          <div key={batchID + st + index + 'x'}>
            <i className='fade small label'>{st}</i>
          </div>
      )})}
    </Fragment>
  );
};

export default KittingChecks;