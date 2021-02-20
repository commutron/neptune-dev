import React from 'react';
import Pref from '/client/global/pref.js';

import CompleteRest from '/client/components/riverX/CompleteRest';

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
        <br />
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
        <br />
      </div>
    );
  }
  
  if(iComplete) {
    return(
      <div className='proPrimeSingle'>
        {
          rapidData.iRapid ? <em>is rapid</em>
          :
          rapidData.rapid && <em>could be rapid</em>
        }
        <CompleteRest
          seriesId={seriesId}
          serial={itemData.serial}
          iComplete={iComplete}
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