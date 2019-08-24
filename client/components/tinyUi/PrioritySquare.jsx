import React from 'react';
import NumStat from '/client/components/uUi/NumStat.jsx';

const PrioritySquare = ({ bffrTime, overQuote })=> {

  const priorityCode = bffrTime <= 0 ?
    bffrTime < -2200 ? 'WL' :
      bffrTime < -500 ? 'DL' : 'L' :
    bffrTime > 2200 ? 'WA' :
      bffrTime > 500 ? 'DA' : 'C';
  const priorityClass = 
    priorityCode === 'WL' ? 'darkRed' :
    priorityCode === 'DL' ? 'red' :
    priorityCode === 'L' ? 'darkOrange' :
    priorityCode === 'WA' ? 'wetasphalt' :
    priorityCode === 'DA' ? 'yellow' : 
    'orange';

  return(
    <div className={`${priorityClass} ${overQuote ? 'moreEphasis' : ''}`}>
      <NumStat
        num={priorityCode || 'x'}
        name={overQuote ? 'Over Quote' : ''}
        title='Prototype priority codes'
        color='whiteT bold'
        size='big' />
    </div>
  );
};

export default PrioritySquare;