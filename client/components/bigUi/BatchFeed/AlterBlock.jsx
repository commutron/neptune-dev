import React from 'react';
// import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ItemFeed/style.css';

import UserNice from '/client/components/smallUi/UserNice.jsx';

const AlterBlock = ({ dt, cal })=>{

  return(
    <div className='infoBlock alterEvent'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>
            <i className="fas fa-eraser fa-lg fa-fw"></i>
          </div>
          
          <div>Altered: <em className='clean'>"{dt.changeKey}"</em></div>
          <div>for {dt.changeReason}</div>
          
        </div>
        
        <div className='rightText'>
          <div><UserNice id={dt.changeWho} /></div>
          <div>{cal(dt.changeDate)}</div>
          <div className='rightAnchor'></div>
        </div>
        
      </div>
      
      <div className='moreInfoList'>
        <dd>{dt.oldValue.toLocaleString()} <i className="fas fa-arrow-right fa-fw"></i> {dt.newValue.toLocaleString()}</dd>
      </div>
    </div>
  );
};

export default AlterBlock;