import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';

import { min2hr, avgOfArray } from '/client/utility/Convert.js';
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
  
  const pt = ptData;
  const q2t = pt?.quote2tide || 0;
  const doneQuote = q2t > 0 ? `Remaining Quoted: ${min2hr(q2t)} hours` : `Over Quoted: ${Math.abs(min2hr(q2t))} hours`;
  
  if(isDone) {
    const doneColor = oRapid ? 'darkOrange' : 'green';
    const doneIcon = oRapid ? 'fa-solid fa-bolt' : 'fa-regular fa-star';
    const doneName = oRapid ? 'Extended' : 'Complete';
    return(
      <NumStat
        num={false}
        icon={doneIcon}
        name={showLess ? '' : doneName}
        title={`${doneName}\n${doneQuote}`}
        color='blackblackT'
        size='bold vbig' 
        moreClass={doneColor}
      />
    );
  }
    
  if( pt && pt.batchID === batchID ) {
    
    const e2t = pt.est2tide;
    const bffrTime = pt.estEnd2fillBuffer;
    const bffrRel = pt.bffrRel;
    const overQuote = pt.overQuote;
    isDebug && console.log({pt, batchID, bffrRel, bffrTime, e2t, overQuote});
    
    if(pt.completed) {
      const doneColor = pt.oRapid ? 'darkOrange' : 'green';
      const doneIcon = pt.oRapid ? 'fa-solid fa-bolt fa-lg' : 'fa-regular fa-star fa-lg';
      const doneName = pt.oRapid ? 'Extended' : 'Complete';
      return(
        <NumStat
          num={false}
          icon={doneIcon}
          name={showLess ? '' : doneName}
          title={`${doneName}\n${doneQuote}`}
          color='blackblackT'
          size='bold vbig'
          moreClass={doneColor}
        />
      );
    }
    
    if(!pt.hold && ( bffrRel === undefined || bffrRel === null || bffrRel === false )) {
      return(
        <NumStat
          num='X'
          name=''
          title={`Priority Rank Unavailable\n${doneQuote}`}
          color='fade'
          size='vbigger'
        />
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
    const bffTxt = `buffer: ${bffrTime || 0} minutes`;
    
    const e2i = pt.est2item || 0;
    const e2iTxt = `Remaining Estimated(curve): ${min2hr(e2i)} hours`;
    const e2tTxt = `Remaining Estimated(past): ${min2hr(e2t)} hours`;
    
    const avgRmn = avgOfArray([q2t, e2t, e2i], true);
    const treTxt = `Estimated Time Remaining: ${min2hr(Math.max(0,avgRmn))} hours`;
    
    const onTime = !pt.estSoonest ? null : new Date(pt.shipAim) > new Date(pt.estSoonest);
    const ontmTxt = onTime ? 'Predicted On Time' : onTime === false ? 'Predicted Late' : 'Prediction Unavailable';
    const soonTxt = `Earliest Completion: ~${moment(pt.estSoonest).format("ddd, MMM Do, h:mm a")}`;
    
    const title = `${prTxt}\n${ovrTxt}\n${doneQuote}\n\n${treTxt}\n${ontmTxt}\n`;
    const debugTitle = `${prTxt}\n${ovrTxt}\n${doneQuote}\nq2t: ${q2t}\n\n${treTxt}\ne2t: ${e2t}\ne2i: ${e2i}\n${ontmTxt}\n\n${soonTxt}\n\n${bffTxt}\nbffrRel: ${pt.bffrRel}`;
    
    if(showExtra && !showLess) {
      return(
        <div 
          className={`${baseClass} ${extraClass} ${priorityClass} ${overClass}`}
          title={isDebug ? debugTitle : title}
        >
          <NumStat
            num={pLabel}
            name={showLess ? '' : subLabel}
            color='blackblackT'
            size='bold big'
          />
          {showExtra && !showLess ? 
            <dl className='med clean noindent espace'>
              <dd>{ontmTxt}</dd>
              <dd>{soonTxt}</dd>
              <dd>{doneQuote}</dd>
              <dd>{treTxt}</dd>
              <dd>{e2tTxt}</dd>
              <dd>{e2iTxt}</dd>
            </dl> : null}
        </div>
      );
    }
    
    if(pt.hold) {
      return(
        <NumStat
          num={<n-faH><i className='fa-solid fa-pause fa-fw'></i></n-faH>}
          title={Pref.isHold}
          color='holdblock'
          size='vbigger'
          title={isDebug ? debugTitle : title}
        />
      );
    }
    
    return(
      <NumStat
        num={pLabel}
        name={showLess ? '' : subLabel}
        color='blackblackT'
        size='bold big'
        title={isDebug ? debugTitle : title}
        moreClass={`${baseClass} ${extraClass} ${priorityClass} ${overClass}`}
      />
    );
  }
  
  return(
    <NumStat
      num={altNumber || '?'}
      name=''
      title='priority rank unknown'
      color='fade'
      size='vbigger'
    />
  );
};