import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Pref from '/client/global/pref.js';

import GeneralChunk from './GeneralChunk.jsx';
import PrioritySquare from '/client/components/bigUi/PrioritySquare.jsx';
import BatchFinish from '/client/components/forms/BatchFinish.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import FloorRelease from '/client/components/smallUi/FloorRelease.jsx';
import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';

const InfoTab = ({
  a, b, user, 
  done, allDone, 
  progCounts, riverTitle, riverAltTitle,
}) =>	{

  return(
    <div className='oneTwoThreeContainer'>
      <div className='oneThirdContent min200'>
      
        <div className='vmarginhalf centreText line2x'>
          
          
            
            { b.live &&
              <div className='centreRow balance'>
                <PrioritySquare
                  batchID={b._id}
                  app={a} />
                <b><i className='fas fa-sync blueT fa-2x' title='Live'></i></b>
              </div>
            }
            <BatchFinish 
              batchId={b._id} 
              finished={done} 
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
        
        <FloorRelease id={b._id} />
        
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