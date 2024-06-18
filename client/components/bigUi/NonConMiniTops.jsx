import React from 'react';
import Pref from '/client/global/pref.js';

import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import NumStat from '/client/components/tinyUi/NumStat.jsx';
import { countMulti } from '/client/utility/Arrays';

export const TotalNonCon = ({ noncons })=> (
  <KpiStat
    num={countMulti(noncons)}
    name='Total NonCons'
    color='var(--pomegranate)'
  />
);
                
                
export const HasNonCon = ({ noncons, items })=> {
  const hasNonCon = [... new Set( Array.from(noncons, x => x.serial) ) ].length;
  return(
    <KpiStat
      num={((hasNonCon / items.length) * 100 ).toFixed(0) + '%'}
      name={'of ' + Pref.item + 's have nonCons'}
      color='var(--pomegranate)'
    />
  );
};

export const NonConPer = ({ noncons, items })=> {
  const ncG = countMulti( noncons.filter( n => !n.trash ) );
  return(
    <KpiStat
      num={(ncG / items.length).toFixed(1, 10)}
      name={'nonCons per ' + Pref.item}
      color='var(--pomegranate)'
    />
  );
};

export const MostNonCon = ({ noncons, app })=> {
  const ncG = noncons.filter( n => !n.trash );
  const mostType = ()=> {
    let types = [];
    for(let t of app.nonConOption) {
      types.push( countMulti( ncG.filter( x => x.type === t ) ) );
    }
    const indexOfMax = types.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    return indexOfMax;
  };
  return(
    <NumStat
      num={app.nonConOption[mostType()]}
      name='Most Common Type'
      title='most frequent'
      color='redT'
      size='big' />
  );
};

export const TodayNonCon = ({ noncons })=> {
  const now = new Date().toDateString();
  const foundToday = noncons.filter( x => 
    new Date(x.time).toDateString() === now );
  const todayCount = countMulti(foundToday);
  return(
    <NumStat
      num={todayCount}
      name='Recorded Today'
      title='12:00am to 11:59pm'
      color='redT'
      size='bigger' />
  );
};

export const IsSkipNonCon = ({ noncons })=> {
  const isSkip = countMulti( noncons.filter( x => 
          x.inspect === false && x.snooze === true ) );
  return(
    <KpiStat
      num={isSkip || 0}
      name='Skipped / Snoozing'
      title='quantity remaining'
      color='var(--sunflower)'
    />
  );
};

export const LeftFxNonCon = ({ noncons })=> {
  const leftToFix = countMulti( noncons.filter( x => 
          x.fix === false && x.inspect === false ) );
  return(
    <KpiStat
      num={leftToFix || 0}
      name='Left To Repair'
      title='quantity remaining'
      color='var(--alizarin)'
    />
  );
};

export const ReadyInNonCon = ({ noncons })=> {
  const rdyToIns = countMulti( noncons.filter( x => 
          x.fix !== false && x.inspect === false ) );
  return(
    <KpiStat
      num={rdyToIns || 0}
      name='Ready To Inspect'
      title='quantity remaining'
      color='var(--carrot)'
    />
  );
};
export const LeftInNonCon = ({ noncons })=> {
  const leftToInspect = countMulti( noncons.filter( x => x.inspect === false ) );
  return(
    <KpiStat
      num={leftToInspect || 0}
      name='Left To Inspect'
      title='quantity remaining'
      color='var(--carrot)'
    />
  );
};

export const IsResNonCon = ({ noncons })=> {
  const isRes = countMulti( noncons.filter( x => x.inspect !== false ) );
  return(
    <KpiStat
      num={isRes || 0}
      name='Resolved'
      title='quantity'
      color='var(--emerald)'
    />
  );
};

export const UserNonCon = ({ noncons, user })=> {
  const count = countMulti( noncons.filter( x => x.who === user._id ) );
  return(
    <NumStat
      num={count}
      name={'Recorded by ' + user.username.split('.')[0]}
      title='no blame'
      color='redT'
      size='bigger' />
  );
};