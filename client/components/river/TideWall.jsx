import React from 'react';
// import moment from 'moment';
// import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
// import Pref from '/client/global/pref.js';

import CompleteRest from './CompleteRest.jsx';
import MiniHistory from './MiniHistory.jsx';

const TideWall = ({ bID, bComplete, itemData, shortfalls }) => {
  
  
  return(
    <div>
      <div>
        <h1 className='biggest'>Item LOCKED</h1>
      </div>
  		
  		<h1 className='biggest'>BIG start</h1>
  		
  		{itemData ?
  		  itemData.finishedAt !== false ?
  		  
    		  <CompleteRest
            id={bID}
            bComplete={bComplete}
            sh={shortfalls}
            serial={itemData.serial}
            history={itemData.history}
            finishedAt={itemData.finishedAt} />
  		    
  		    :
  		    
          <MiniHistory history={itemData.history} />
        
        : null }
  	</div>
  );
};

export default TideWall;