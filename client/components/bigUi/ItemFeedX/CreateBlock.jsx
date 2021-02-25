import React from 'react';
import './style.css';
//import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const CreateBlock = ({ title, user, datetime, cal })=> (
  
  <div className='feedInfoBlock create'>
    <div className='feedInfoTitle'>
      <div>
        <div className='leftAnchor'>
          <i className="fas fa-plus-circle fa-lg fa-fw"></i>
        </div>
        <div>{title}</div>
      </div>
      <div className='rightText'>
        <div><UserNice id={user} /></div>
        <div>{cal(datetime)}</div>
        <div className='rightAnchor'></div>
      </div>
    </div>
  </div>
);

export default CreateBlock;