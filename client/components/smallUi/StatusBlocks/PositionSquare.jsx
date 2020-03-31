import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import NumStat from '/client/components/uUi/NumStat.jsx';

import './style';

const PositionSquareData = ({ batchID, app, dbDay, mockDay, altNumber, isDebug })=> {
  
  const thingMounted = useRef(true);
  const [ posData, setPosition ] = useState(false);
  
  useEffect( ()=> {
    const clientTZ = moment.tz.guess();
    Meteor.call('agendaOrder', batchID, clientTZ, false, mockDay, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        if(thingMounted.current) { setPosition( reply ); }
        isDebug && console.log(posData);
      }
    });
  }, [batchID, dbDay, mockDay]);
  
  useEffect( ()=> {
    return () => { thingMounted.current = false };
  }, []);
  
  return( 
    <PositionSquare 
      batchID={batchID} 
      posData={posData}
      altNumber={altNumber}
      app={app}
      isDebug={isDebug} /> 
  );
};

export default PositionSquareData;

///////////////////////////////////////////////////////////////////////////////

export const PositionSquare = ({ batchID, posData, altNumber, app, isDebug })=> {
  
  const pos = posData;
  
  if( pos && pos.batchID === batchID ) {
    
    const q2t = pos.quote2tide;
    const bffrTime = pos.estEnd2fillBuffer;
    const overQuote = q2t < 0;
    isDebug && console.log({pos, batchID, bffrTime, q2t});
  
    if(!bffrTime) {
      return(
        <div>
          <NumStat
            num={<i className='bigger bold'>X</i>}
            name=''
            title='priority rank unavailable'
            color='fade'
            size='big' />
        </div>
      );
    }
    
    const pScl = !app.priorityScale ? {
      low: 6600,
      high: 2200,
      max: 0,
    } : app.priorityScale;
    
    const priorityRank = 
      bffrTime > pScl.low ? 'low' :
        bffrTime > pScl.high ? 'medium' : 
          bffrTime > pScl.max ? 'high' :
            bffrTime <= pScl.max ? 'urgent' :
            'p0';
    const priorityClass = 
      priorityRank === 'urgent' ? 'agScale1' :
      priorityRank === 'high' ? 'agScale2' :
      priorityRank === 'medium' ? 'agScale3' : 
      'agScale4';
    const overClass = overQuote ? 'moreEphasis' : '';
    const pLabel = 
      <b>{priorityRank}</b>;
    const subLabel = pos.lateLate ? 'Is Late' :
      bffrTime < 0 ? 'Estimated Late' :
      Math.round( ( bffrTime / 100 ) );
    
    const ovrTxt = overQuote ? 'Over Quote' : 'Under Quote';
    const prTxt = `Priority Rank "${priorityRank}"`;
    const bffTxt = `buffer: ${bffrTime} minutes`;
    const treTxt = `timeRemain: ${q2t} minutes`;
    
    const title = `${prTxt}\n${ovrTxt}`;
    const debugTitle = `${prTxt}"\n${bffTxt}\n${ovrTxt}\n${treTxt}`;
    
    return(
      <div className={`blackT smCap big ${priorityClass} ${overClass}`}>
        <NumStat
          num={pLabel}
          name={subLabel}
          // name={`${subLabel}${isNightly ? ` (${altNumber})` : ''}`}
          title={isDebug ? debugTitle : title}
          color='blackT'
          size='big' />
      </div>
    );
  }
  
  return(
    <div>
      <NumStat
        num={<i className='bigger bold'>?</i>}
        name=''
        title='priority rank unknown'
        color='fade'
        size='big' />
    </div>
  );
};