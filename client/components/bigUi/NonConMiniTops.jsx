import React from 'react';
import Pref from '/public/pref.js';

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
  const iQty = items.length > 0 ? items.reduce((t,i)=> t + i.units, 0) : 0;
  
  const hasNonCon = new Set( Array.from(noncons, x => x.serial) ).size;
  
  const asPcnt = (val, total)=> {
    const prcnt = ((val / total) * 100 );
    return prcnt < 1 ? prcnt.toFixed(1) : prcnt.toFixed(0);
  };
  
  let splitOut = [];
  const haswhere = new Set( Array.from(noncons, x => x.where) );
  for( let w of haswhere) {
    splitOut.push({
      wh: w,
      num: new Set( Array.from(noncons, x => x.where === w && x.serial).filter(f=>f) ).size
    });
  }
  return(
    <KpiStat
      num={asPcnt(hasNonCon, iQty) + '%'}
      name={'of all ' + Pref.item + 's have nonCons'}
      color='var(--pomegranate)'
      more={
        <div className='cap'>
          <p>% of Items have nonCons in:</p>
          <dl className='readlines'>
            {splitOut.map( (x, i) => 
              <dd className='rightRow doJustWeen' key={i} style={{margin:'2px'}}>
                <span>{x.wh}</span> <span>{asPcnt(x.num, iQty)}%</span>
              </dd>
            )}
          </dl>
        </div>
      }
    />
  );
};

export const NonConPer = ({ noncons, items })=> {
  const ncG = countMulti( noncons.filter( n => !n.trash && !(n.inspect && !n.fix) ) );
  const itemQty = items.length > 0 ? items.reduce((t,i)=> t + i.units, 0) : 0;
  return(
    <KpiStat
      num={(ncG / itemQty).toFixed(1, 10)}
      name={'nonCons per ' + Pref.item}
      color='var(--pomegranate)'
    />
  );
};

export const MostNonCon = ({ noncons, app })=> {
  const ncG = noncons.filter( n => !n.trash && !(n.inspect && !n.fix) );
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