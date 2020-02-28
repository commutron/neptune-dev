import React from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

// import UserNice from '/client/components/smallUi/UserNice.jsx';


const QuoteBlock = ({ dt })=>{

  const hoursDur = moment.duration(dt.timeAsMinutes, "minutes")
                    .asHours().toFixed(2, 10);
  
  return(
    <div className='infoBlock alterEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="fas fa-hourglass-start fa-lg fa-fw iG"></i>
          </div>
          <div>Quote Time set to {hoursDur} hours</div> 
          <div>({dt.timeAsMinutes} minutes)</div>
        </div>
        <div className='rightText'>
          <div>{moment(dt.updatedAt).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'></div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBlock;