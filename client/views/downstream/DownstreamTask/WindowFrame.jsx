import React from 'react';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';
import DownstreamHeaders from './DownstreamHeaders';

const WindowFrame = ({ 
  windowMoment, loaded, mixedOrders, 
  indexKey, traceDT,
  app, user, isDebug, focusBy, dense
})=> (
  <div className={`downGridFrameFixed 
                  ${indexKey === -1 ? 'rapidtitle' : 
                    indexKey === 0 ? 'latetitle' : ''}`}
  >
    <div className='downWeek' title={`ship day ${indexKey}`}
      >{indexKey === -1 ? Pref.rapidEx : indexKey === 0 ? 'Late' : 
        windowMoment.format('dddd MMM DD')
      }
    </div>
    
    <div className='downHeadFixed grayT cap'>{loaded}</div>
      
    <div className='downOrdersFixed'>
      <DownstreamHeaders
        indexKey={indexKey}
        oB={mixedOrders}
        traceDT={traceDT}
        title='things'
        showMore={true}
        user={user}
        app={app}
        isDebug={isDebug}
        isNightly={false}
        focusBy={focusBy}
        dense={dense}
      />
    </div>
  </div>
);

export default WindowFrame;