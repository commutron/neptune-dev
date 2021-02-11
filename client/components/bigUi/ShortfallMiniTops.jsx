import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';

const ShortfallMiniTops = ({ shortfalls, items, user, app })=> (
  <div className='centre'>
    <HasShortfall shortfalls={shortfalls} items={items} />
    
    <RefCount shortfalls={shortfalls} items={items} />
    
    <PartsShort shortfalls={shortfalls} items={items} />
    
    <LeftToResolve shortfalls={shortfalls} />
    
  </div>
);
export default ShortfallMiniTops;


export const HasShortfall = ({ shortfalls, items })=> {
  const hasShort = [... new Set( Array.from(shortfalls, x => { return x.serial }) ) ].length;
  return(
    <NumStat
      num={((hasShort / items.length) * 100 ).toFixed(0) + '%'}
      name={'of ' + Pref.item + 's have shortfalls'}
      color='orangeT'
      size='bigger' />
  );
};

export const RefCount = ({ shortfalls })=> {
  const refTotal = shortfalls.reduce( (arr, x)=>
      arr + x.refs.length, 0 );
  return(
    <NumStat
      num={refTotal}
      name='locations short'
      color='orangeT'
      size='bigger' />
  );
};

export const PartsShort = ({ shortfalls, items })=> {
  const partShort = [... new Set( Array.from(shortfalls, x => { return x.partNum }) ) ].length;
  return(
    <NumStat
      num={partShort}
      name='partNums short'
      color='orangeT'
      size='bigger' />
  );
};

export const LeftToResolve = ({ shortfalls })=> {
  const done = shortfalls.filter( s => s.inEffect === true || s.reSolve === true ).length;
  const left = shortfalls.length - done;
  return(
    <NumStat
      num={left}
      name='Left To Resolve'
      title='quantity remaining'
      color='orangeT'
      size='bigger' />
  );
};