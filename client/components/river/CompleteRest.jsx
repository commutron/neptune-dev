import React from 'react';
import moment from 'moment';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';
import UndoFinish from '/client/components/forms/UndoFinish.jsx';

const CompleteRest = ({ id, bComplete, sh, serial, history, finishedAt }) => {
  
  const iDone = history;

// end of flow
  const timelock = moment().diff(moment(finishedAt), 'minutes') > (60 * 24 * 7);
  return (
    <div>
      <div>
        <InOutWrap type='stoneTrans'>
          <div>
            <div className='purpleBorder centre cap'>
              <h2>{Pref.trackLast}ed</h2>
              <h3>{moment(iDone[iDone.length -1].time).calendar()}</h3>
                {bComplete === false ?
                  <span className='space centre'>
                    {timelock && <p><i className='fas fa-lock fa-fw fa-lg'></i></p>}
                    <UndoFinish
                	    id={id}
                	    serial={serial}
                	    finishedAt={finishedAt}
                	    timelock={timelock}
                	    noText={false} />
              	  </span>
                : <p><i className='fas fa-lock fa-fw fa-lg'></i></p>}
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