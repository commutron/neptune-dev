import React from 'react';
import Pref from '/client/global/pref.js';

import ScrapBox from '/client/components/smallUi/ScrapBox.jsx';
import MiniHistory from '/client/components/river/MiniHistory.jsx';

const ItemCard = ({ itemData, iSerial, hasRiver, isReleased, scrap })=> {

  //const done = itemData.finishedAt !== false;
  
  
  if(!hasRiver) {
    Session.set('ncWhere', Pref.outOfFlow);
    Session.set('nowStepKey', undefined);
    return(
      <div className='proPrimeSingle centre centreText'>
        <p><i className="fas fa-exclamation-circle fa-5x redT"></i></p>
        <p className='medBig'>
          This {Pref.batch} does not have a {Pref.flow}
        </p>
        <br />
      </div>
    );
  }
    
  if(!isReleased) {
    Session.set('ncWhere', Pref.outOfFlow);
    Session.set('nowStepKey', undefined);
    return(
      <div className='proPrimeSingle centre centreText space'>
        <p><i className="fas fa-exclamation-triangle fa-5x orangeT"></i></p>
        <p className='medBig'>
          This {Pref.batch} has not been released from Kitting
        </p>
        <p><em>
          "Release to the Floor" must be recorded
        </em></p>
        <br />
      </div>
    );
  }

  if(scrap) {
    return(
      <div className='proPrimeSingle'>
        <ScrapBox entry={scrap} />
        <MiniHistory history={itemData.history} />
      </div>
    );
  }
      
  return(null);
};

export default ItemCard;