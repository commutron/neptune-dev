import React from 'react';
// import moment from 'moment';
// import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
// import Pref from '/client/global/pref.js';

import MiniHistory from './MiniHistory.jsx';

const TideWall = ({ bID, bComplete, itemData }) => {
  
  
  return(
    <div>
      <div>
        <h1 className='biggest'>LOCK</h1>
      </div>
  		
  		{itemData &&
        <MiniHistory history={itemData.history} />
  		}
  	</div>
  );
};

export default TideWall;