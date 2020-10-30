import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { min2hr } from '/client/utility/Convert.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';

import './style';

const PrioritySquareData = ({ 
  batchID, app, dbDay, mockDay, isDone,
  altNumber, isDebug, showExtra, showLess
})=> {
  
  const thingMounted = useRef(true);
  const [ ptData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('priorityRank', batchID, false, mockDay, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        if(thingMounted.current) { setPriority( reply ); }
        isDebug && console.log(ptData);
      }
    });
  }, [batchID, dbDay, mockDay]);
  
  useEffect( ()=> {
    return () => { thingMounted.current = false };
  }, []);
  
  return( 
    <PrioritySquare 
      batchID={batchID} 
      ptData={ptData}
      isDone={isDone}
      altNumber={altNumber}
      app={app}
      isDebug={isDebug}
      showExtra={showExtra}
      showLess={showLess} /> 
  );
};

export default PrioritySquareData;

///////////////////////////////////////////////////////////////////////////////

export const PrioritySquare = ({ 
  batchID, ptData, isDone,
  altNumber, app, isDebug, showExtra, showLess
})=> {
  
  if(isDone) {
    return(
      <div className='green'>
        <NumStat
          num={<i className="far fa-star fa-lg"></i>}
          name=''
          title='Complete'
          color=''
          size='' />
      </div>
    );
  }
    
  const pt = ptData;
  
  if( pt && pt.batchID === batchID ) {
    
    const q2t = pt.quote2tide;
    const bffrTime = pt.estEnd2fillBuffer;
    const overQuote = q2t < 0;
    isDebug && console.log({pt, batchID, bffrTime, q2t});

    if(pt.isDone) {
      return(
        <div className='green'>
          <NumStat
            num={<i className="far fa-star fa-lg"></i>}
            name=''
            title='Complete'
            color=''
            size='' />
      </div>
      );
    }
    
    if(!bffrTime) {
      return(
        <div>
          <NumStat
            num='X'
            name=''
            title='priority rank unavailable'
            color='fade'
            size='vbigger bold' />
        </div>
      );
    }
    
    const baseClass = 'blackT smCap big';
    const extraClass = showExtra ? 'centre' : '';
    
    const pScl = !app.priorityScale ? {
      low: 6600,
      high: 2200,
      max: 0,
    } : app.priorityScale;
    
    const priorityRank = 
      bffrTime > pScl.low ? 'low' :
        bffrTime > pScl.high ? 'medium' : 
          bffrTime > pScl.max ? 'high' :
            bffrTime <= pScl.max ? pt.lateLate ? 'severe' : 'urgent' :
            'pX';
    const priorityClass = 
      priorityRank === 'severe' ? 'pScale0' :
      priorityRank === 'urgent' ? 'pScale1' :
      priorityRank === 'high' ? 'pScale2' :
      priorityRank === 'medium' ? 'pScale3' : 
      'pScale4';
    
    const tNum = Math.round( ( bffrTime / 100 ) );
    const tSym = pt.lateLate ? 'S!' : tNum < 0 ? 'U' : tNum;
    
    const pLabel = <b>{showLess ? tSym : priorityRank}</b>;
    
    const subLabel = pt.lateLate ? 'Is Late' :
      bffrTime < 0 ? 'Estimated Late' : tNum;
      
    const overClass = overQuote ? 'moreEphasis' : '';
    const ovrTxt = overQuote ? 'Over Quote' : 'Under Quote';
    
    const prTxt = `Priority Rank "${priorityRank}"`;
    const bffTxt = `buffer: ${bffrTime} minutes`;
    const treTxt = `Quote Time Remaining: ${min2hr(q2t)} hours`;
    const soonTxt = `Soonest Complete: ${moment(pt.estSoonest).format("ddd, MMM Do, h:mm a")}`;
    const mustTxt = `Must Be Active By: ${moment(pt.estLatestBegin).format("ddd, MMM Do, h:mm a")}`;
    
    const title = `${prTxt}\n${ovrTxt}\n${treTxt}\n${soonTxt}\n${mustTxt}`;
    const debugTitle = `${prTxt}\n${bffTxt}\n${ovrTxt}\n${treTxt}\n${soonTxt}\n${mustTxt}`;
    
    return(
      <div 
        className={`${baseClass} ${extraClass} ${priorityClass} ${overClass}`}
        title={isDebug ? debugTitle : title}
      >
        <NumStat
          num={pLabel}
          name={showLess ? '' : subLabel}
          // name={`${subLabel}${isNightly ? ` (${altNumber})` : ''}`}
          color='blackT'
          size='big vBanner' />
        {showExtra && !showLess ? 
          <dl className='med clean noindent espace'>
            <dd>{treTxt}</dd>
            <dd>{soonTxt}</dd>
            <dd>{mustTxt}</dd>
          </dl> : null}
      </div>
    );
  }
  
  return(
    <div>
      <NumStat
        num='?'
        name=''
        title='priority rank unknown'
        color='fade'
        size='vbigger bold vBanner' />
    </div>
  );
};