import React, { Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ScrapBox from '/client/components/smallUi/ScrapBox.jsx';
import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';

const CompleteRest = ({ 
  id, bComplete, iCascade, shortfallS, serial, 
  history, finishedAt, scrap
})=> {
  
  const iDone = history;

// end of flow
  return(
    <Fragment>
      {scrap ?
        <ScrapBox entry={scrap} />
      :
        <div className='finishBanner wide'>
          <div className='purpleBorder centreText cap'>
            <h2>{Pref.trackLast}ed</h2>
            <h3>{moment(iDone[iDone.length -1].time).calendar()}</h3>
          </div>
        </div>
      }

      <Shortfalls
			  id={id}
			  shortfalls={shortfallS}
			  lock={finishedAt !== false} />

      <MiniHistory history={history} />
      
      {iCascade &&
        <p className='centreText'>
          <i className="fas fa-exchange-alt fa-2x fa-fw orangeT"></i>{Pref.rmaProcess} has been activated
        </p>
      }
  	</Fragment>
  );
};

export default CompleteRest;