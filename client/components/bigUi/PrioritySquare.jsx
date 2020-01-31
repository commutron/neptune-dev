import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import NumStat from '/client/components/uUi/NumStat.jsx';

const PrioritySquareData = ({ batchID, app, dbDay, mockDay, altNumber })=> {

  const [ ptData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    const clientTZ = moment.tz.guess();
    Meteor.call('priorityRank', batchID, clientTZ, false, mockDay, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setPriority( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(ptData);
      }
    });
  }, [batchID, dbDay, mockDay]);
  
  return( 
    <PrioritySquare 
      batchID={batchID} 
      ptData={ptData}
      altNumber={altNumber}
      app={app} /> 
  );
};

export default PrioritySquareData;

///////////////////////////////////////////////////////////////////////////////

export const PrioritySquare = ({ batchID, ptData, altNumber, app })=> {
  
  const pt = ptData;
  
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
   
  if( pt && pt.batchID === batchID ) {
    
    const q2t = pt.quote2tide;
    const bffrTime = pt.estEnd2fillBuffer;
    const overQuote = q2t < 0;
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({pt, batchID, bffrTime, q2t});
  
    if(!bffrTime) {
      return(
        <div>
          <NumStat
            num='n/a'
            name=''
            title='priority unavailable'
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
            bffrTime <= pScl.max ? 'severe' :
            'p0';
    const priorityClass = 
      priorityRank === 'severe' ? 'pScale1' :
      priorityRank === 'high' ? 'pScale2' :
      priorityRank === 'medium' ? 'pScale3' : 
      'pScale4';
    const overClass = overQuote ? 'moreEphasis' : '';
    const pLabel = 
      <b>{priorityRank}</b>;
    const subLabel = pt.lateLate ? 'Is Late' :
      bffrTime < 0 ? 'Estimated Late' :
      Math.round( ( bffrTime / 100 ) );
    
    return(
      <div className={`blackT smCap big ${priorityClass} ${overClass}`}>
        <NumStat
          num={pLabel}
          name={`${subLabel}${isNightly ? ` (${altNumber})` : ''}`}
          title={
            `Priority Rank "${priorityRank}" \nbuffer: ${bffrTime} minutes\n${overQuote ? 'Over Quote' : ''}`
          }
          color='blackT'
          size='big' />
      </div>
    );
  }
  
  return(
    <div>
      <NumStat
        num='?'
        name=''
        title='priority unknown'
        color='fade'
        size='big' />
    </div>
  );
};