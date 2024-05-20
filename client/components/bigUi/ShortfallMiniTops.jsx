import React from 'react';
import Pref from '/client/global/pref.js';

import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import { countMulti } from '/client/utility/Arrays';

export const TotalShortfall = ({ shortfalls })=> (
  <KpiStat
    num={countMulti(shortfalls)}
    name='Total Shortfalls'
    color='var(--orange)'
  />
);
                
export const HasShortfall = ({ shortfalls, items })=> {
  const hasShort = [... new Set( Array.from(shortfalls, x => x.serial) ) ].length;
  return(
    <KpiStat
      num={((hasShort / items.length) * 100 ).toFixed(0) + '%'}
      name={'of ' + Pref.item + 's have shortfalls'}
      color='var(--orange)'
    />
  );
};

export const RefCount = ({ shortfalls })=> {
  const refTotal = shortfalls.reduce( (arr, x)=>
      arr + ( x.refs.length * (x.multi || 1) ), 0 );
  return(
    <KpiStat
      num={refTotal}
      name='Locations Short'
      color='var(--orange)'
    />
  );
};

export const PartsShort = ({ shortfalls })=> {
  const partShort = [... new Set( Array.from(shortfalls, x => x.partNum) ) ].length;
  return(
    <KpiStat
      num={partShort}
      name='Part Numbers Short'
      color='var(--orange)'
    />
  );
};

export const LeftToResolve = ({ shortfalls })=> {
  const done = shortfalls.filter( s => s.inEffect === true || s.reSolve === true ).length;
  const left = countMulti(shortfalls) - done;
  return(
    <KpiStat
      num={left}
      name='Left To Resolve'
      title='quantity remaining'
      color='var(--orange)'
    />
  );
};
      
export const ShortDec = ({ shortfalls })=> (
  <KpiStat
    num={countMulti( shortfalls.filter( s => s.inEffect === null ) )}
    name='Awaiting Decision'
    color='var(--sunflower)'
  />
);
export const ShortPass = ({ shortfalls })=> (
  <KpiStat
    num={countMulti( shortfalls.filter( s => s.inEffect === true ) )}
    name='Ship Without'
    color='var(--concrete)'
  />
);
export const ShortWait = ({ shortfalls })=> (
  <KpiStat
    num={countMulti( shortfalls.filter( s => s.inEffect === false && !s.reSolve ) )}
    name='Waiting For Part'
    color='var(--carrot)'
  />
);
export const ShortRes = ({ shortfalls })=> (
  <KpiStat
    num={countMulti( shortfalls.filter( s => s.reSolve === true ) )}
    name='Resolved'
    color='var(--emerald)'
  />
);