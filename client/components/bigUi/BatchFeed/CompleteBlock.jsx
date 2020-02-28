import React from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

// import UserNice from '/client/components/smallUi/UserNice.jsx';


const CompleteBlock = ({ title, datetime })=> (
  
  <div className='infoBlock finish'>
    <div className='blockTitle cap'>
      <div>
        <div className='leftAnchor'><i className="fas fa-flag-checkered fa-lg fa-fw iPlain"></i></div>
        <div>{title}</div>
      </div>
      <div className='rightText'>
        <div>{moment(datetime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
        <div className='rightAnchor'></div>
      </div>
    </div>
  </div>
);

export default CompleteBlock;