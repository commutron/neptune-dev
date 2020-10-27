import React, { Fragment } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
import Pref from '/client/global/pref.js';

import WindowFrame from './WindowFrame';
import WindowGlass from './WindowGlass';

import { LeapTextLink } from '/client/components/tinyUi/LeapText.jsx';

const asHours = (min) => moment.duration(min, "minutes").asHours().toFixed(2, 10);

const ShipWindows = ({ 
  calcFor, bCache, pCache, acCache, zCache,
  brancheS, app, user, clientTZ, density
})=> {

  const nonWorkDays = app.nonWorkDays;
  if( Array.isArray(nonWorkDays) ) {  
    moment.updateLocale('en', {
      holidays: nonWorkDays
    });
  }
  
  const now = moment();
  const in50 = now.clone().add(50, 'd');
  const next50Days = [];
  if( !now.isShipDay() ) { 
    next50Days.push( now.clone().nextShipDay() );
  }else{
    next50Days.push( now.clone() ); 
  }
  for(let n = now; n.isBefore(in50); n.add(1, 'd')) {
    if(n.isShipDay()) {
      let shipTime = n.clone().nextShipDay();
      if(shipTime.isSameOrBefore(in50, 'day')) {
        next50Days.push(shipTime);
      }
    }
  }
  const lateCatch = next50Days[0];
  const lateBatch = pCache.filter( x => moment(x.shipTime).isBefore(lateCatch, 'day') );
  const lateTimeArr = Array.from(lateBatch, x => typeof x.quote2tide === 'number' && x.quote2tide );
  const lateTimeTotal = lateTimeArr.reduce( (arr, x)=> x > 0 ? arr + x : arr, 0 );
          
  return(
    <div className={`downstreamContent forceScrollStyle ${density}`}>
    {/*
      <div key='0x0' className='downGridFrame'>
        <div className='downWeek'>
      
          <dt title='0'>Missed Ship Date (before {lateCatch.format('dddd MMM DD')})</dt>
          <dt> -> A debt of {asHours(lateTimeTotal)} hours total remain</dt>
        </div>
        <div className='downOrders'>
          <BatchListPending batchList={lateBatch} bCache={bCache} />
        </div>
      </div>
       */}  
       
      <div className={`downstreamFixed forceScrollStyle ${density}`}>
      {next50Days.map( (e, ix)=>( 
        <WindowFrame 
          windowMoment={e}
          indexKey={ix}
          bCache={bCache}
          pCache={pCache}
          acCache={acCache}
          zCache={zCache}
          brancheS={brancheS}
          app={app}
          user={user}
          clientTZ={clientTZ}
        />
      ))}
      </div>
      
      <div className={`downstreamScroll forceScrollStyle ${density}`}>
        {next50Days.map( (e, ix)=>( 
        <WindowGlass
          windowMoment={e}
          indexKey={ix}
          bCache={bCache}
          pCache={pCache}
          acCache={acCache}
          zCache={zCache}
          brancheS={brancheS}
          app={app}
          user={user}
          clientTZ={clientTZ}
        />
      ))}
      </div>
      
      
      
    </div>
  );
};

export default ShipWindows;


const BatchListPending = ({ batchList, bCache })=> (
  <div>
    {Array.isArray(batchList) && batchList.length > 0 ?
      batchList.map( (b, ix)=>{
        const moreInfo = bCache ? bCache.find( x => x.batch === b.batch) : false;
        const what = moreInfo ? moreInfo.isWhat : 'unavailable';
        const q2t = b.quote2tide;
        const q2tStatus = q2t === false ? 'Time Not Tracked' :
          q2t > 0 ? 
            `${asHours(q2t)} hours remain` :
            'Over-Quote, remaining time unknown';
        return(
          <dd key={ix} title={`${what}, ${q2t} minutes`} className='fade'>
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