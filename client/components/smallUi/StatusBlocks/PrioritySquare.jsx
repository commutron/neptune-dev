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
    if(mockDay) {
      Meteor.call('priorityRank', batchID, false, mockDay, (error, reply)=>{
        error && console.log(error);
        if( reply ) { 
          if(thingMounted.current) { setPriority( reply ); }
          isDebug && console.log(ptData);
        }
      });
    }else{
      Meteor.call('priorityTrace', batchID, (error, reply)=>{
        error && console.log(error);
        if( reply ) { 
          if(thingMounted.current) { setPriority( reply ); }
          isDebug && console.log(ptData);
        }
      });
    }
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
  batchID, ptData, isDone, oRapid,
  altNumber, app, isDebug, showExtra, showLess
})=> {
  
  if(isDone) {
    const doneColor = oRapid ? 'darkOrange' : 'green';
    const doneIcon = oRapid ? 'fas fa-bolt' : 'far fa-star';
    const doneName = oRapid ? 'Extended' : 'Complete';
    return(
      <div className={doneColor}>
        <NumStat
          num={false}
          icon={doneIcon}
          name={doneName}
          title={doneName}
          color='blackblackT'
          size='bold vbig' />
      </div>
    );
  }
    
  const pt = ptData;
  
  if( pt && pt.batchID === batchID ) {
    
    const q2t = pt.quote2tide;
    const bffrTime = pt.estEnd2fillBuffer;
    const bffrRel = pt.bffrRel;
    const overQuote = pt.overQuote;
    isDebug && console.log({pt, batchID, bffrRel, bffrTime, q2t, overQuote});
    
    if(pt.completed) {
      const doneColor = pt.oRapid ? 'darkOrange' : 'green';
      const doneIcon = pt.oRapid ? 'fas fa-bolt fa-lg' : 'far fa-star fa-lg';
      const doneName = pt.oRapid ? 'Extended' : 'Complete';
      return(
        <div className={doneColor}>
          <NumStat
            num={false}
            icon={doneIcon}
            name={doneName}
            title={doneName}
            color='blackblackT'
            size='bold vbig' />
        </div>
      );
    }
    
    if(bffrRel === undefined || bffrRel === null || bffrRel === false) {
      return(
        <div>
          <NumStat
            num='X'
            name=''
            title='priority rank unavailable'
            color='fade'
            size='vbigger' />
        </div>
      );
    }
    
    const baseClass = 'blackblackT smCap big';
    const extraClass = showExtra ? 'centre' : '';
    
    const pScl = !app.priorityScale ? {
      low: 66,
      high: 22,
      max: 0,
    } : app.priorityScale;
    
    const priorityRank = 
      bffrRel > pScl.low ? 'low' :
        bffrRel > pScl.high ? 'medium' : 
          bffrRel > pScl.max ? 'high' :
            bffrRel <= pScl.max ? pt.lateLate ? 'severe' : 'urgent' :
            'pX';
    const priorityClass = 
      priorityRank === 'severe' ? 'pScale0' :
      priorityRank === 'urgent' ? 'pScale1' :
      priorityRank === 'high' ? 'pScale2' :
      priorityRank === 'medium' ? 'pScale3' : 
      'pScale4';
    
    const tSym = pt.lateLate ? 'S!' : bffrRel <= pScl.max ? 'U' : bffrRel;
    
    const pLabel = showLess ? tSym : priorityRank;
    
    const subLabel = pt.lateLate ? 'Is Late' :
      bffrRel <= pScl.max ? 'Estimated Late' : bffrRel;
      
    const overClass = overQuote ? 'moreEphasis' : '';
    const ovrTxt = overQuote ? 'Over Quote' : 'Under Quote';
    
    const prTxt = `Priority Rank "${priorityRank}"`;
    const bffTxt = `buffer: ${bffrTime} minutes`;
    const treTxt = `Estimated Time Remaining: ${min2hr(q2t)} hours`;
    const soonTxt = `Soonest Complete: ${moment(pt.estSoonest).format("ddd, MMM Do, h:mm a")}`;
    
    const title = `${prTxt}\n${ovrTxt}\n\n${treTxt}\n${soonTxt}`;
    const debugTitle = `${prTxt}\n${ovrTxt}\n\n${treTxt}\n${soonTxt}\n\n${bffTxt}\n${pt.bffrRel}`;
    
    return(
      <div 
        className={`${baseClass} ${extraClass} ${priorityClass} ${overClass}`}
        title={isDebug ? debugTitle : title}
      >
        <NumStat
          num={pLabel}
          name={showLess ? '' : subLabel}
          color='blackblackT'
          size='bold big' />
        {showExtra && !showLess ? 
          <dl className='med clean noindent espace'>
            <dd>{treTxt}</dd>
            <dd>{soonTxt}</dd>
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
        size='vbigger' />
    </div>
  );
};