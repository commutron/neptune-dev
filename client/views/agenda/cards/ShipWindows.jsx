import React, { Fragment } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time-ship';
import '/client/components/utilities/ShipTime.js';
import Pref from '/client/global/pref.js';

import { LeapTextLink } from '/client/components/tinyUi/LeapText.jsx';

const asHours = (min) => moment.duration(min, "minutes").asHours().toFixed(2, 10);

const ShipWindows = ({ pCache, zCache, app })=> {

  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  
  const now = moment();
  const in100 = now.clone().add(100, 'd');
  const next100Days = [];
  if( !now.isShipDay() ) { 
    next100Days.push( now.clone().nextShipDay() );
  }else{
    next100Days.push( now.clone() ); 
  }
  for(let n = now; n.isBefore(in100); n.add(1, 'd')) {
    if(n.isShipDay()) {
      let shipTime = n.clone().nextShipDay();
      if(shipTime.isSameOrBefore(in100, 'day')) {
        next100Days.push(shipTime);
      }
    }
  }
  const lateCatch = next100Days[0];
  const lateBatch = pCache.filter( x => moment(x.shipTime).isBefore(lateCatch, 'day') );
  const lateTimeArr = Array.from(lateBatch, x => typeof x.quote2tide === 'number' && x.quote2tide );
  const lateTimeTotal = lateTimeArr.reduce( (arr, x)=> x > 0 ? arr + x : arr, 0 );
          
  return(
    <div className='wide max600 space line2x'>
      <h3>Ship Days for the next 100 days</h3>
      <h5></h5>
      <dl>
        <dt title='0'>Missed Ship Date (before {lateCatch.format('dddd MMM DD')})</dt>
        <dt> -> A debt of {asHours(lateTimeTotal)} hours total remain</dt>
          <BatchListPending batchList={lateBatch} />
          
        {next100Days.map( (e, ix)=>{
          const shipIn = pCache.filter( x => moment(x.shipTime).isSame(e, 'day') );
          const reTimeArr = Array.from(shipIn, 
            x => typeof x.quote2tide === 'number' && x.quote2tide );
          const reTimeTotal = reTimeArr.reduce( 
            (arr, x)=> x > 0 ? arr + x : arr, 0 );
            
          const early = zCache.filter( x => {
            const endDay = moment(x.salesEnd);
            const shipTime = endDay.isShipDay() ? 
              endDay.nextShippingTime() : endDay.lastShippingTime();
            if(moment(shipTime).isSame(e, 'day')) { return true }
          });
        
          return(
            <Fragment key={ix}>
              <dt title={`ship day ${ix+1}`}>{e.format('dddd MMM DD')}
              {reTimeTotal > 0 && <i> -> {asHours(reTimeTotal)} hours total remain</i>}</dt>
              <BatchListComplete batchList={early} />
              <BatchListPending batchList={shipIn} />
            </Fragment>
          );
        })}
      </dl>
    </div>
  );
};

export default ShipWindows;

const BatchListComplete = ({ batchList })=> (
  <div>
    {Array.isArray(batchList) && batchList.length > 0 ?
      batchList.map( (b, ix)=>{
        return(
          <dd key={ix+'z'} className='fade cap'>
          <LeapTextLink
            title={b.batchNum} 
            sty='numFont whiteT'
            address={'/data/batch?request=' + b.batchNum}
          /> -> {Pref.batch} is {Pref.isDone}</dd>
        );
      })
    :
      null}
  </div> 
);

const BatchListPending = ({ batchList })=> (
  <div>
    {Array.isArray(batchList) && batchList.length > 0 ?
      batchList.map( (b, ix)=>{
        const q2t = b.quote2tide;
        const q2tStatus = q2t === false ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${asHours(q2t)} hours remain` :
            'Over-Quote, remaining time unknown';
        return(
          <dd key={ix} title={`${q2t} minutes`} className='fade'>
          <LeapTextLink
            title={b.batch} 
            sty='numFont whiteT'
            address={'/data/batch?request=' + b.batch}
          /> -> {q2tStatus}</dd>
        );
      })
    :
      null}
  </div> 
);