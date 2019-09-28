import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import NumStat from '/client/components/uUi/NumStat.jsx';

const PrioritySquareData = ({ batchID, app })=> {

  const [ ptData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    const clientTZ = moment.tz.guess();
    Meteor.call('priorityRank', batchID, clientTZ, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setPriority( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(ptData);
      }
    });
  }, [batchID]);
  
  return( 
    <PrioritySquare 
      batchID={batchID} 
      ptData={ptData} 
      app={app} /> 
  );
};

export default PrioritySquareData;

///////////////////////////////////////////////////////////////////////////////

export const PrioritySquare = ({ batchID, ptData, app })=> {
  
  const pt = ptData;
   
  if( pt && pt.batchID === batchID ) {
    
    const q2t = pt.quote2tide;
    const bffrTime = pt.estEnd2fillBuffer;
    const overQuote = q2t < 0;
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({batchID, bffrTime, q2t});
  
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
    
    const priorityCode = 
      bffrTime > pScl.low ? 'p4' :
        bffrTime > pScl.high ? 'p3' : 
          bffrTime > pScl.max ? 'p2' :
            bffrTime <= pScl.max ? 'p1' :
            'p0';
    const priorityClass = 
      priorityCode === 'p1' ? 'pScale1' :
      priorityCode === 'p2' ? 'pScale2' :
      priorityCode === 'p3' ? 'pScale3' : 
      'pScale4';
    const pLabel = 
      <i>{priorityCode.split("")[0]}<b>{priorityCode.split("")[1]}</b></i>;
    
    return(
      <div className={`${priorityClass} ${overQuote ? 'moreEphasis' : ''}`}>
        <NumStat
          num={pLabel}
          name={Math.round( ( bffrTime / 1000 ) )}
          title={`Priority Code "${priorityCode}" \n${overQuote ? 'Over Quote' : ''}`}
          color='whiteT'
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