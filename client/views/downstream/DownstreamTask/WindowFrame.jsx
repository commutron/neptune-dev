import React from 'react';
import Pref from '/client/global/pref.js';
import DownstreamHeaders from './DownstreamHeaders';

const WindowFrame = ({ 
  windowMoment, loaded, mixedOrders, 
  indexKey, traceDT,
  app, user, isDebug, 
  focusBy, tagBy, dense, stormy
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
    
    <div className='downHeadFixed grayT cap' title={loaded[2] || ''}
    >{loaded[1] === 'heavy' ? <n-fa2><i className='fas fa-circle fa-fw gapR'></i></n-fa2> :
      loaded[1] === 'light' ? <n-fa1><i className='far fa-circle fa-fw gapR'></i></n-fa1> :
      loaded[1] === 'balanced' ? <n-fa3><i className='fas fa-adjust fa-fw gapR'></i></n-fa3> :
      loaded[1] && <n-fa0><i className='fas fa-bullseye fa-fw gapR'></i></n-fa0>}
    {`${loaded[0]} ${loaded[1] || ''}`}
    </div>
      
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
        tagBy={tagBy}
        dense={dense}
        stormy={stormy}
      />
    </div>
  </div>
);

export default WindowFrame;