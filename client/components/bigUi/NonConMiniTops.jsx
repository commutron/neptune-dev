import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';
import { countMulti } from '/client/utility/Arrays';

const NonConMiniTops = ({ noncons, items, user, app })=> (
  <div className='centre'>
    <HasNonCon noncons={ncG} items={items} />
    
    <NonConPer noncons={ncG} items={items} />

    <MostNonCon noncons={ncG} app={app} />
    
    <TodayNonCon noncons={ncG} />
    
    <LeftFxNonCon noncons={ncG} />
    
    <LeftInNonCon noncons={ncG} />
    
    {/*<UserNonCon noncons={noncons} user={user} />*/}
  </div>
);
export default NonConMiniTops;


export const HasNonCon = ({ noncons, items })=> {
  const ncG = noncons.filter( n => !n.trash );
  const hasNonCon = [... new Set( Array.from(ncG, x => x.serial) ) ].length;
  return(
    <NumStat
      num={((hasNonCon / items.length) * 100 ).toFixed(0) + '%'}
      name={'of ' + Pref.item + 's have nonCons'}
      color='redT'
      size='bigger'
      moreClass='max100 wmargin' />
  );
};

export const NonConPer = ({ noncons, items })=> {
  const ncG = countMulti( noncons.filter( n => !n.trash ) );
  return(
    <NumStat
      num={(ncG / items.length).toFixed(1, 10)}
      name={'nonCons per ' + Pref.item}
      title='mean average'
      color='redT'
      size='bigger' />
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
  const ncG = noncons.filter( n => !n.trash );
  const now = moment().format();
  const foundToday = ncG.filter( x => 
    moment(x.time).isSame(now, 'day') === true );
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

export const LeftFxNonCon = ({ noncons })=> {
  const ncG = noncons.filter( n => !n.trash );
  const leftToFix = countMulti( ncG.filter( x => 
          x.fix === false && x.inspect === false ) );
  return(
    <NumStat
      num={leftToFix || 0}
      name='Left To Repair'
      title='quantity remaining'
      color='redT'
      size='bigger' />
  );
};

export const LeftInNonCon = ({ noncons })=> {
  const ncG = noncons.filter( n => !n.trash );
  const leftToInspect = countMulti( ncG.filter( x => x.inspect === false ) );
  return(
    <NumStat
      num={leftToInspect || 0}
      name='Left To Inspect'
      title='quantity remaining'
      color='orangeT'
      size='bigger' />
  );
};

export const UserNonCon = ({ noncons, user })=> {
  const ncG = noncons.filter( n => !n.trash );
  const count = countMulti( ncG.filter( x => x.who === user._id ) );
  return(
    <NumStat
      num={count}
      name={'Recorded by ' + user.username.split('.')[0]}
      title='no blame'
      color='redT'
      size='bigger' />
  );
};