import React from 'react';
// import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

const EventBlock = ({ dt, cal })=>{

  return(
    <div className='infoBlock genericEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="far fa-calendar-plus fa-lg fa-fw"></i>
          </div>
          <div>{dt.title} - {dt.detail}</div>
        </div>
        <div className='rightText'>
          <div>{cal(dt.time)}</div>
          <div className='rightAnchor'></div>
        </div>
      </div>
    </div>
  );
};

export default EventBlock;