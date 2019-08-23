import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import TimeBudgetBar from '/client/components/charts/TimeBudgetBar/TimeBudgetBar.jsx';

const TimeBudgetsChunk = ({
  a, b, v,
  totalUnits,
}) =>	{

  if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
    const clientTZ = moment.tz.guess();
    Meteor.call('getDistanceFromFulfill', b.batch, clientTZ, (err, re)=>{
      err && console.log(err);
      re && console.log(re);
    });
  }
  
  
  const totalST = ()=> {
    let totalTime = 0;
    let totalPeople = new Set();
    if(!b.tide) {
      null;
    }else{
      for(let bl of b.tide) {
        const mStart = moment(bl.startTime);
        const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
        const block = Math.round( 
          moment.duration(mStop.diff(mStart)).asMinutes() );
        totalTime = totalTime + block;
        totalPeople.add(bl.who);
      }
    }
    return { totalTime, totalPeople };
  };
  const totalsCalc = totalST();
  const asHours = (mnts) => moment.duration(mnts, "minutes").asHours().toFixed(1, 10);
  
  const tU = !totalUnits ? 0 : totalUnits;
  
  const qtReady = v.quoteTimeScale;
  
  const qtRelevant = qtReady && b.finishedAt !== false ?
    v.quoteTimeScale.filter( x => moment(x.updatedAt).isSameOrBefore(b.finishedAt) )
    : v.quoteTimeScale;
    
  const qTS = qtReady && qtRelevant.length > 0 ? 
                qtRelevant[0].timeAsMinutes : 0;
  let qTSU = qTS * tU;
  
  const totalQuoteMinutes = qTSU || 0;
  const totalQuoteAsHours = asHours(totalQuoteMinutes);
  
  const totalTideMinutes = totalsCalc.totalTime;
  const totalTideAsHours = asHours(totalTideMinutes);
  
  const quote2tide = totalQuoteMinutes - totalTideMinutes;
  const bufferNice = Math.abs(quote2tide);
  const bufferAsHours = asHours(bufferNice);
  const bufferMessage = quote2tide < 0 ?
    "exceeding quoted" : "remaining of quoted";
  
  const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
  const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
  
  Roles.userIsInRole(Meteor.userId(), 'debug') && 
  console.log({
    totalQuoteMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });

  const totalPeople = [...totalsCalc.totalPeople];
  const tP = totalPeople.length;
  
  return(
    <div className=''>
      <div className='space aFrameContainer'>
        
        <div className='avOneContent big'>
          <p className='medBig'>Total time recorded with Start-Stop:</p>
          <p>sum of time blocks, each rounded to their nearest minute</p>
          {!moment(b.createdAt).isAfter(a.tideWall) && 
            <p className='orangeT'>{` ** This ${Pref.batch} was created before \n
              Start-Stop was enacted. Totals may not be acurate`} 
            </p>}
          <hr />
        </div>
        
        <div className='avTwoContent numFont'>
          <TimeBudgetBar a={totalTideMinutes} b={totalLeftMinutes} c={totalOverMinutes} />
          <p
            className='bigger' 
            title={`${totalQuoteMinutes} minutes\n(aka ${totalQuoteAsHours} hours)\nQuoted`}
          >{totalQuoteMinutes} <i className='med'>minutes quoted</i>
          </p>
          <p 
            className='bigger' 
            title={`${totalTideMinutes} minutes\n(aka ${totalTideAsHours} hours)\nLogged`}
          >{totalTideMinutes} <i className='med'>minutes logged</i>
          </p>
          <p 
            className='bigger' 
            title={`${bufferNice} minutes\n(aka ${bufferAsHours} hours)\n${bufferMessage}`}
          >{bufferNice} <i className='med'>minutes {bufferMessage}</i>
          </p>
        </div>
        
        <div className='avThreeContent numFont'>
          <TimeBudgetBar a={tP} b={0} c={0} />
          <p>
            <span className='bigger'>{tP}</span> 
            {tP === 1 ? ' person' : ' people'}
          </p>
          <ul>
            {totalPeople.map((per, ix)=>{
              return( <li key={ix}><UserNice id={per} /></li> );
            })}
          </ul>
        </div>

      </div>
        
      
      <details className='footnotes'>
        <summary>Calculation Details</summary>
        <p className='footnote'>
          {`Quoted time is the latest available time set
           --before the ${Pref.batch} is finished--`} 
        </p>
        <p className='footnote'>
          Logged time is recorded to the second and is displayed to the nearest minute.
        </p>
        <p className='footnote'>
          minutes_quoted = quote_time_scale({qTS}) * total_units({tU})
        </p>
      </details>
      
              
    </div>  
  );
};

export default TimeBudgetsChunk;