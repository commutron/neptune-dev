import React, { Fragment } from 'react';
import moment from 'moment';

import ScrapBox from '/client/components/smallUi/ScrapBox.jsx';
import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';

const CompleteRest = ({ 
  bComplete, iAlt, shortfallS, 
  seriesId, serial, iComplete, history, scrap
})=> (
  <Fragment>
  
    {scrap ?
      <ScrapBox entry={scrap} />
    :
      <div className='purpleBorder centreText cap wordBr'>
        <h2>Completed</h2>
        <h3>{moment(iComplete).calendar()}</h3>
      </div>
    }
    
    <MiniHistory history={history} iAlt={iAlt} />
    
    <Shortfalls
		  seriesId={seriesId}
		  shortfalls={shortfallS}
		  lock={typeof iComplete === 'object'} />
    
	</Fragment>
);

export default CompleteRest;