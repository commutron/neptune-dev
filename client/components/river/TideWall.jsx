import React from 'react';
// import moment from 'moment';
// import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
// import Pref from '/client/global/pref.js';

import MiniHistory from './MiniHistory.jsx';

const TideWall = ({ bID, bComplete, itemData }) => {
  
  
  return(
    <div>
      <div>
        <h1 className='biggest'>Item LOCKED</h1>
      </div>
  		
  		<h1 className='biggest'>Item is complete ???</h1>
  		
  		<h1 className='biggest'>BIG start button</h1>
  		
  		
  		{itemData &&
        <MiniHistory history={itemData.history} />
  		}
  	</div>
  );
};

export default TideWall;