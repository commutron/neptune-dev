import React, { useEffect } from 'react';
import moment from 'moment';
import business from 'moment-business';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import { TimeBudgetUpgrade, WholeTimeBudget } from '/client/components/forms/QuoteTimeBudget.jsx';
import TimeBudgetBar from '/client/components/charts/Tides/TimeBudgetBar.jsx';

const TimeBudgetsChunk = ({
  a, b, v,
  totalUnits, clientTZ
}) =>	{
  
  useEffect( ()=>{
    if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
      Meteor.call('assemblePhaseTime', b._id, clientTZ, (err, reply)=>{
        err && console.log(err);
        reply && console.log(reply);
      });
    }
  }, []);
  
  
  const totalSTbyPeople = ()=> {
    let totalTime = 0;
    let peopleTime = [];
    let usersNice = [];
    if(!b.tide) {
      null;
    }else{
      const usersGrab = Array.from(b.tide, x => x.who );
      usersNice = [...new Set(usersGrab)];
      
      for(let ul of usersNice) {
        let userTime = 0;
        const userTide = b.tide.filter( x => x.who === ul );
        for(let bl of userTide) {
          const mStart = moment(bl.startTime);
          const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
          const block = Math.round( 
            moment.duration(mStop.diff(mStart)).asMinutes() );
          totalTime = totalTime + block;
          userTime = userTime + block;
        }
        peopleTime.push({
          uID: ul,
          uTime: userTime
        });
      }
    }
    return { totalTime, peopleTime };
  };
  
  //const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
  
  const totalsCalc = totalSTbyPeople();

  const asHours = (mnts) => moment.duration(mnts, "minutes").asHours().toFixed(2, 10);

  const qtBready = !b.quoteTimeBudget ? false : true;
  const qtB = qtBready && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  
  const totalQuoteMinutes = qtB || 0;
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

  const totalPeople = totalsCalc.peopleTime;
  const tP = totalPeople.length;

  
  return(
    <div className=''>
      <div className='space aFrameContainer'>
        
        <div className='avOneContent big'>
          {!moment(b.createdAt).isAfter(a.tideWall) && 
            <p className='orangeT'>{` ** This ${Pref.batch} was created before \n
              Start-Stop was enacted. Totals may not be acurate`} 
            </p>}
        </div>
        
        <div className='avTwoContent numFont'>
          <TimeBudgetBar a={totalTideMinutes} b={totalLeftMinutes} c={totalOverMinutes} />
          <p
            className='bigger' 
            title={`${Math.round(totalQuoteMinutes)} minutes\nQuoted`}
          >{totalQuoteAsHours} <i className='med'>hours budgeted</i>
          </p>
          <p 
            className='bigger' 
            title={`${Math.round(totalTideMinutes)} minutes\nLogged`}
          >{totalTideAsHours} <i className='med'>hours logged</i>
          </p>
          <p 
            className='bigger' 
            title={`${Math.round(bufferNice)} minutes\n${bufferMessage}`}
          >{bufferAsHours} <i className='med'>hours {bufferMessage}</i>
          </p>
          
          <div className='vmargin'>
            {!qtBready ? <TimeBudgetUpgrade bID={b._id} /> :
              <WholeTimeBudget bID={b._id} /> }
          </div>
          
        </div>
        
        <div className='avThreeContent numFont'>
          <TimeBudgetBar a={tP} b={0} c={0} />
          <p>
            <span className='bigger'>{tP}</span> 
            {tP === 1 ? ' person' : ' people'}
          </p>
          <ul>
            {totalPeople.map((per, ix)=>{
              return( 
                <li 
                  key={ix}
                  title={`${per.uTime} minutes`}
                ><i className='big'><UserNice id={per.uID} /></i>
                <i className='grayT'> {asHours(per.uTime)} hours</i></li> 
              );
            })}
          </ul>
        </div>

      </div>
        
      
      <details className='footnotes'>
        <summary>Calculation Details</summary>
        <p className='footnote'>Sum of time blocks are each rounded to their nearest minute</p>
        <p className='footnote'>
          {`Quoted time is the latest available time set
           --before the ${Pref.batch} is finished--`} 
        </p>
        <p className='footnote'>
          Logged time is recorded to the second and is displayed to the nearest minute.
        </p>
        <p className='footnote'>
          Update quoted time budget in hours to 2 decimal places. minutes_quoted = {qtB}
        </p>
      </details>
      
              
    </div>  
  );
};

export default TimeBudgetsChunk;