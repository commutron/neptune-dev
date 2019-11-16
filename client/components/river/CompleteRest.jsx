import React from 'react';
import moment from 'moment';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';

const CompleteRest = ({ id, bComplete, sh, serial, history, finishedAt }) => {
  
  const iDone = history;

// end of flow
  return(
    <div>
      <div>
        <InOutWrap type='stoneTrans'>
          <div>
            <div className='purpleBorder centre cap'>
              <h2>{Pref.trackLast}ed</h2>
              <h3>{moment(iDone[iDone.length -1].time).calendar()}</h3>
            </div>
          </div>
        </InOutWrap>
      </div>
  		<div>
        <Shortfalls
  			  id={id}
  			  shortfalls={sh}
  			  lock={finishedAt !== false} />
      </div>
      <div className='space'>
			  <MiniHistory history={history} />
			</div>
  	</div>
  );
};

export default CompleteRest;