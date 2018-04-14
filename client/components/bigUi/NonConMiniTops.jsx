import React from 'react';
import NumBox from '/client/components/uUi/NumBox.jsx';
import moment from 'moment';

const NonConMiniTops = ({ noncons, user, app })=> {
  
  const now = moment().format();
  const foundToday = noncons.filter( x => 
    moment(x.time).isSame(now, 'day') === true ).length;
  const foundByUser = noncons.filter( x => x.who === user._id ).length;
  const leftToFix = noncons.filter( x => 
    x.fix === false && 
    ( x.skip === false || x.snooze === true )
  ).length;
  const leftToInspect = noncons.filter( x => 
    x.inspect === false && 
    ( x.skip === false || x.snooze === true )
  ).length;
  const mostType = ()=> {
    let types = [];
    for(let t of app.nonConOption) {
      types.push( noncons.filter( x => x.type === t ).length );
    }
    const indexOfMax = types.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    return indexOfMax;
  };
  
  return(
    <div className='centre'>
      <br />
      <NumBox
        num={foundToday}
        name='Recorded Today'
        color='redT' />
      <br />
      <NumBox
        num={foundByUser}
        name={'Recorded by ' + user.username.split('.')[0]}
        color='redT' />
      <br />
      <NumBox
        num={leftToFix}
        name='Left To Repair'
        color='redT' />
      <br />
      <NumBox
        num={leftToInspect}
        name='Left To Inspect'
        color='orangeT' />
      <br />
      <div className='centre'>
        <i className='redT cap big centreText'>
          {app.nonConOption[mostType()]}
        </i>
        <i className='smCap'>Most Common Type</i>
      </div>
      <br />
    </div>
  );
};

export default NonConMiniTops;