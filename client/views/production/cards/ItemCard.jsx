import React from 'react';
import Pref from '/client/global/pref.js';

import CompleteRest from '/client/components/river/CompleteRest.jsx';
//import ScrapBox from '/client/components/smallUi/ScrapBox.jsx';
// import MiniHistory from '/client/components/river/MiniHistory.jsx';

const ItemCard = ({ 
  itemData, iSerial, 
  hasRiver, isReleased, 
  iFinished, scrap,
  bID, bComplete, iCascade, shortfallS 
})=> {

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

  if(iFinished) {
    return(
      <div className='proPrimeSingle'>
        <CompleteRest
          id={bID}
          bComplete={bComplete}
          shortfallS={shortfallS}
          serial={itemData.serial}
          history={itemData.history}
          finishedAt={itemData.finishedAt}
          iCascade={iCascade}
          scrap={scrap} />
        
      </div>
    );
  }
      
  return(null);
};

export default ItemCard;