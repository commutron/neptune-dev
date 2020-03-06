import React from 'react';
// import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

import GeneralChunk from './GeneralChunk.jsx';
import PrioritySquareData from '/client/components/bigUi/PrioritySquare';
import TideActivityData from '/client/components/tide/TideActivity';
import BatchFinish from '/client/components/forms/BatchFinish.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';

const InfoTab = ({
  a, b, user, 
  done, allDone, 
  progCounts, riverTitle, riverAltTitle,
}) =>	{

  // const [ phasePercent, phasePercentSet ] = useState([]);
  
  // useEffect( ()=> {
  //   Meteor.call('phaseProgress', b._id, (err, re)=>{
  //     err && console.log(err);    
  //     if(re) {
  //       const smplePhPro = Array.from(re.phaseSets, x => {
  //         let calc = Math.floor( ( x.count / (re.totalItems * x.steps.length) 
  //           * 100 ) );
  //         return {
  //           phase: x.phase,
  //           progPer: calc,
  //           nc: x.ncLeft
  //         };
  //       });
  //       phasePercentSet( smplePhPro );
  //     }
  //   });
  // }, []);
  // console.log(phasePercent);
  
  const released = b.releases.findIndex( x => x.type === 'floorRelease') >= 0;

  return(
    <div className='oneTwoThreeContainer'>
      <div className='oneThirdContent min200'>
      
        <div className='vmarginhalf centreText line2x'>
            
            { b.live &&
              <div className='centreRow balance'>
                <div className='statusBlock'>
                  <PrioritySquareData
                    batchID={b._id}
                    app={a}
                    dbDay={b.end} />
                </div>
                <div className='statusBlock'>
                  <TideActivityData
                    batchID={b._id}
                    app={a} />
                </div>
              </div>
            }
            <BatchFinish 
              batchId={b._id} 
              finished={done}
              finishedAt={b.finishedAt} 
              allFinished={allDone}
              live={b.live} />
          
        </div>
        
        <div className='vmargin'>
          <WatchButton 
            list={user.watchlist}
            type='batch'
            keyword={b.batch} />
        </div>
        
        <GeneralChunk a={a} b={b} done={done} expand={true} />

      </div>
              
      <div className='twoThirdsContent'>
        
        {!released && 
          <ReleaseAction 
            id={b._id} 
            rType='floorRelease'
            actionText='release'
            contextText='to the floor'
            isX={false} />}
        
        <StepsProgress
          progCounts={progCounts}
          riverTitle={riverTitle}
          riverAltTitle={riverAltTitle}
          truncate={false} />
        
      </div>

    </div>
  );
};

export default InfoTab;