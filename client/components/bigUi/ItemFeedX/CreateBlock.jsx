import React from 'react';
import moment from 'moment';
import './style.css';
//import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const CreateBlock = ({ title, user, datetime, calString })=> (
  
  <div className='infoBlock create'>
    <div className='blockTitle cap'>
      <div>
        <div className='leftAnchor'><i className="fas fa-plus-circle fa-lg fa-fw iPlain"></i></div>
        <div>{title}</div>
      </div>
      <div className='rightText'>
        <div><UserNice id={user} /></div>
        <div>{moment(datetime).calendar(null, {sameElse: calString})}</div>
        <div className='rightAnchor'></div>
      </div>
    </div>
  </div>
);

export default CreateBlock;