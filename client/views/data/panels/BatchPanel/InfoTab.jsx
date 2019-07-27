import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Pref from '/client/global/pref.js';

import GeneralChunk from './GeneralChunk.jsx';
import BatchFinish from '/client/components/forms/BatchFinish.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';
import StepsProgress from '/client/components/bigUi/StepsProgress/StepsProgress.jsx';
import EventsList from '/client/components/smallUi/EventsList.jsx';

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
            <b><i className='fas fa-sync blueT fa-2x' title='Live'></i></b>
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
        
          <StepsProgress
            progCounts={progCounts}
            riverTitle={riverTitle}
            riverAltTitle={riverAltTitle}
            truncate={false} />
          <h3 className='centreText'>Events</h3>          
          <EventsList events={b.events} />
        
      </div>

    </div>
  );
};

export default InfoTab;