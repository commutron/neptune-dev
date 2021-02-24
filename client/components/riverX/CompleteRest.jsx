import React, { Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ScrapBox from '/client/components/smallUi/ScrapBox.jsx';
import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';

const CompleteRest = ({ 
  bComplete, iAlt, shortfallS, 
  seriesId, serial, iComplete, history, scrap
})=> {
  
  const iDone = history;

// end of flow
  return(
    <Fragment>
      {scrap ?
        <ScrapBox entry={scrap} />
      :
        <div className='finishBanner wide wordBr'>
          <div className='purpleBorder centreText cap'>
            <h2>{Pref.trackLast}ed</h2>
            <h3>{moment(iDone[iDone.length -1].time).calendar()}</h3>
          </div>
        </div>
      }

      <Shortfalls
			  seriesId={seriesId}
			  shortfalls={shortfallS}
			  lock={iComplete} />

      <MiniHistory history={history} />
      
      {iAlt && iAlt.length > 0 &&
        <i>contains alt path</i>
      }
  	</Fragment>
  );
};

export default CompleteRest;