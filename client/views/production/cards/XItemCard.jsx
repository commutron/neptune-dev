import React from 'react';
import Pref from '/client/global/pref.js';

import CompleteRest from '/client/components/riverX/CompleteRest';
import RapidFork from '/client/components/riverX/RapidFork';

const XItemCard = ({ 
  bComplete, isReleased, hasRiver, rapidData,
  seriesId, itemData, iComplete, shortfallS, scrap 
})=> {
  
  if(!iComplete && !isReleased) {
    Session.set('ncWhere', Pref.outOfFlow);
    Session.set('nowStepKey', undefined);
    return(
      <div className='proPrimeSingle centre centreText space'>
        <p><i className="fas fa-exclamation-triangle fa-5x orangeT"></i></p>
        <p className='medBig'>
          This {Pref.xbatch} has not been released from Kitting
        </p>
        <p><em>
          "Release to the Floor" must be recorded
        </em></p>
      </div>
    );
  }

  if(!iComplete && !hasRiver) {
    Session.set('ncWhere', Pref.outOfFlow);
    Session.set('nowStepKey', undefined);
    return(
      <div className='proPrimeSingle centre centreText'>
        <p><i className="fas fa-exclamation-circle fa-5x redT"></i></p>
        <p className='medBig'>
          This {Pref.xbatch} does not have a {Pref.flow}
        </p>
      </div>
    );
  }
  
  if(iComplete) {
    return(
      <div className='proPrimeSingle'>
        {rapidData.rapDo.length > 0 && !rapidData.rapIs ?
          <RapidFork 
            seriesId={seriesId}
            serial={itemData.serial}
            rapidData={rapidData} />
        :null}
        <CompleteRest
          seriesId={seriesId}
          serial={itemData.serial}
          iComplete={itemData.completedAt}
          history={itemData.history}
          iAlt={itemData.altPath}
          scrap={scrap}
          bComplete={bComplete}
          shortfallS={shortfallS} />
      </div>
    );
  }
      
  return(null);
};

export default XItemCard;