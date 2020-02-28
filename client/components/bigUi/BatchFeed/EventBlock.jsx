import React from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

const EventBlock = ({ dt })=>{

  return(
    <div className='infoBlock genericEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="far fa-calendar-plus fa-lg fa-fw iG"></i>
          </div>
          <div>{dt.title} - {dt.detail}</div>
        </div>
        <div className='rightText'>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'></div>
        </div>
      </div>
    </div>
  );
};

export default EventBlock;