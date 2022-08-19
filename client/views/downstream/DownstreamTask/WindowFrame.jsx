import React from 'react';
import Pref from '/client/global/pref.js';
import DownstreamHeaders from './DownstreamHeaders';

const WindowFrame = ({ 
  windowMoment, loaded, mixedOrders, 
  indexKey, traceDT,
  app, user, isDebug, holdShow, holdshowSet,
  focusBy, tagBy, dense, stormy
})=> {
  
  const dayOrders = indexKey === 0 ? mixedOrders.filter( o => !o.hold ) : mixedOrders;
  const hldOrders = indexKey === 0 ? mixedOrders.filter( o => o.hold ) : [];
  
  return(
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
          oB={dayOrders}
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
        
        {hldOrders.length > 0 &&
          <button 
            id="allHoldBatch" 
            className='overGridRowFixed grayFade beside'
            onClick={()=>holdshowSet(!holdShow)}
          >
            <span className={`gap middle ${dense ? 'med' : 'vbig'}`}>
            {holdShow ?
              <n-fa0><i className="fa-solid fa-angles-down fa-lg gap"></i></n-fa0> :
              <n-fa1><i className="fa-solid fa-angles-right fa-lg gap"></i></n-fa1>
            }
            </span>
            <span className={dense ? 'med' : 'vbig'}
            >On Hold <sup>{hldOrders.length}</sup></span>
          </button>
        }
        
        {holdShow &&
          <DownstreamHeaders
            indexKey={indexKey+'hld'}
            oB={hldOrders}
            traceDT={traceDT}
            title='On Hold'
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
        }
      </div>
    </div>
  );
};

export default WindowFrame;