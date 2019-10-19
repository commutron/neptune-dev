import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Pref from '/client/global/pref.js';

import GeneralChunk from './GeneralChunk.jsx';
import PrioritySquareData from '/client/components/bigUi/PrioritySquare.jsx';
import BatchFinish from '/client/components/forms/BatchFinish.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import FloorRelease from '/client/components/smallUi/FloorRelease.jsx';
import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';

const InfoTab = ({
  a, b, user, 
  done, allDone, 
  progCounts, riverTitle, riverAltTitle,
}) =>	{

  let released = b.floorRelease === undefined ? undefined : 
                  b.floorRelease === false ? false :
                  typeof b.floorRelease === 'object';
                  
  return(
    <div className='oneTwoThreeContainer'>
      <div className='oneThirdContent min200'>
      
        <div className='vmarginhalf centreText line2x'>
            
            { b.live &&
              <div className='centreRow balance'>
                <div className='statusBlock'>
                  <PrioritySquareData
                    batchID={b._id}
                    app={a} />
                </div>
                <b><i className='fas fa-lightbulb trueyellowT fa-3x' title='Live'></i></b>
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
        
        {released === undefined ? null :
          released === false && 
            <FloorRelease id={b._id} />}
        
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