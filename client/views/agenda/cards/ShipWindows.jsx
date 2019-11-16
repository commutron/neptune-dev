import React, { Fragment } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time-ship';
import '/client/components/utilities/ShipTime.js';


const ShipWindows = ({ pCache, app })=> {

  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  
  const now = moment();
  const next100Days = [];
  if( !now.isShipDay() ) { 
    next100Days.push( now.clone().nextShipDay() );
  }else{
    next100Days.push( now.clone() ); 
  }
  for(let n = 0; n < 101; n++) {
    const loopDate = now.clone().add(n, 'd');
    if(loopDate.isShipDay()) {
      let shipTime = loopDate.clone().nextShipDay();
      next100Days.push(shipTime);
    }
  }
  const lateCatch = next100Days[0];
  const lateBatch = pCache.filter( x => moment(x.shipTime).isBefore(lateCatch, 'day') );
  const lateTimeArr = Array.from(lateBatch, x => x.quote2tide > 0 && x.quote2tide );
  const lateTimeTotal = lateTimeArr.reduce( (arr, x)=> typeof x === 'number' && arr + x, 0 );
          
  const asHours = (min) => moment.duration(min, "minutes").asHours().toFixed(2, 10);
  
  return(
    <div className='wide space line2x'>
      <h3>Ship Days</h3>
      <h5>next 100 days</h5>
      <dl>
      <dt>0. Missed Ship Date, was before {lateCatch.format('dddd MMM DD')}
        {lateTimeTotal > 0 && <i> -> A debt of {asHours(lateTimeTotal)} hours remain</i>}</dt>
        {lateBatch.map( (lB, lx)=>{
          return(
            <dd key={lx} title={lB.quote2tide} className='fade'
            >{lB.batch} -> {asHours(lB.quote2tide)} hours remain</dd>
        )})}
      
      {next100Days.map( (e, ix)=>{
        const shipIn = pCache.filter( x => moment(x.shipTime).isSame(e, 'day') );
        const reTimeArr = Array.from(shipIn, 
          x => x.quote2tide > 0 && x.quote2tide );
        const reTimeTotal = reTimeArr.reduce( 
          (arr, x)=> typeof x === 'number' && arr + x, 0 );
      
        return(
          <Fragment key={ix}>
            <dt>{ix+1}. {e.format('dddd MMM DD')}
            {reTimeTotal > 0 && <i> -> {asHours(reTimeTotal)} hours total remain</i>}</dt>
            {shipIn.map( (sB, sx)=>{
              return(
                <dd key={sx} title={sB.quote2tide} className='fade'
                >{sB.batch} -> {asHours(sB.quote2tide)} hours remain</dd>
            )})}
          </Fragment>
        );
      })}
      </dl>
    </div>
  );
};

export default ShipWindows;