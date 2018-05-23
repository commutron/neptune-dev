import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';

const NonConMiniTops = ({ noncons, items, user, app })=> (
  <div className='centre'>
    <HasNonCon noncons={noncons} items={items} />
    
    <NonConPer noncons={noncons} items={items} />

    <MostNonCon noncons={noncons} app={app} />
    
    <TodayNonCon noncons={noncons} />
    
    <LeftFxNonCon noncons={noncons} />
    
    <LeftInNonCon noncons={noncons} />
    
    {/*<UserNonCon noncons={noncons} user={user} />*/}
  </div>
);
export default NonConMiniTops;


export const HasNonCon = ({ noncons, items })=> {
  let hasNonCon = 0;
  for(let i of items) {
    noncons.find( n => n.serial === i.serial ) ? hasNonCon += 1 : null;
  }
  return(
    <NumStat
      num={((hasNonCon / items.length) * 100 ).toFixed(0) + '%'}
      name={'of ' + Pref.item + 's have nonCons'}
      color='redT'
      size='bigger' />
  );
};

export const NonConPer = ({ noncons, items })=> (
  <NumStat
    num={(noncons.length / items.length).toFixed(1)}
    name={'nonCons per ' + Pref.item}
    title='mean average'
    color='redT'
    size='bigger' />
);

export const MostNonCon = ({ noncons, app })=> {
  const mostType = ()=> {
    let types = [];
    for(let t of app.nonConOption) {
      types.push( noncons.filter( x => x.type === t ).length );
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
      size='bigger' />
  );
};

export const TodayNonCon = ({ noncons })=> {
  const now = moment().format();
  const foundToday = noncons.filter( x => 
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
  const leftToFix = noncons.filter( x => 
    x.fix === false && 
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
  const leftToInspect = noncons.filter( x => 
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

export const UserNonCon = ({ noncons, user })=> (
  <NumStat
    num={noncons.filter( x => x.who === user._id ).length}
    name={'Recorded by ' + user.username.split('.')[0]}
    title='no blame'
    color='redT'
    size='bigger' />
);