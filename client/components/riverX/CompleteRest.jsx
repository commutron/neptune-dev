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
      <div className='endBox borderPurple wordBr'>
        <h3>Completed</h3>
        <h4>{moment(iComplete).calendar()}</h4>
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