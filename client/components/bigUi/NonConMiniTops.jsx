import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';

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
  const hasNonCon = [... new Set( Array.from(ncG, x => { return x.serial }) ) ].length;
  return(
    <NumStat
      num={((hasNonCon / items.length) * 100 ).toFixed(0) + '%'}
      name={'of ' + Pref.item + 's have nonCons'}
      color='redT'
      size='bigger' />
  );
};

export const NonConPer = ({ noncons, items })=> {
  const ncG = noncons.filter( n => !n.trash );
  return(
    <NumStat
      num={(ncG.length / items.length).toFixed(1, 10)}
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
      types.push( ncG.filter( x => x.type === t ).length );
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
    moment(x.time).isSame(now, 'day') === true ).length;
  return(
    <NumStat
      num={foundToday}
      name='Recorded Today'
      title='12:00am to 11:59pm'
      color='redT'
      size='bigger' />
  );
};

export const LeftFxNonCon = ({ noncons })=> {
  const ncG = noncons.filter( n => !n.trash );
  const leftToFix = ncG.filter( x => 
    x.fix === false && x.inspect === false &&
      ( x.skip === false || x.snooze === true )
    ).length;
  return(
    <NumStat
      num={leftToFix}
      name='Left To Repair'
      title='quantity remaining'
      color='redT'
      size='bigger' />
  );
};

export const LeftInNonCon = ({ noncons })=> {
  const ncG = noncons.filter( n => !n.trash );
  const leftToInspect = ncG.filter( x => 
    x.inspect === false && 
      ( x.skip === false || x.snooze === true )
    ).length;
  return(
    <NumStat
      num={leftToInspect}
      name='Left To Inspect'
      title='quantity remaining'
      color='orangeT'
      size='bigger' />
  );
};

export const UserNonCon = ({ noncons, user })=> {
  const ncG = noncons.filter( n => !n.trash );
  return(
    <NumStat
      num={ncG.filter( x => x.who === user._id ).length}
      name={'Recorded by ' + user.username.split('.')[0]}
      title='no blame'
      color='redT'
      size='bigger' />
  );
};