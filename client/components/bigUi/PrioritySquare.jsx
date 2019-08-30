import React, { useState, useEffect } from 'react';
import NumStat from '/client/components/uUi/NumStat.jsx';

const PrioritySquare = ({ batchID, app })=> {
  
  const [ ptData, setPriority ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('priorityRank', batchID, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setPriority( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(ptData);
      }
    });
  }, [batchID]);
  
  const pt = ptData;
   
  if( pt && pt.batchID === batchID ) {
    
    const bffrTime = pt.estEnd2fillBuffer;
    const overQuote = pt.overQuote;
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({batchID, bffrTime, overQuote});
  
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
    
    const priorityCode = 
      bffrTime > 2200*3 ? 'p4' :
        bffrTime > 2200 ? 'p3' : 
          bffrTime > 0 ? 'p2' :
            bffrTime <= 0 ? 'p1' :
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
          name=''
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

export default PrioritySquare;