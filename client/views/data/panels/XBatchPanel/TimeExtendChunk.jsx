import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
// import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import ToggleBar from '/client/components/smallUi/Tabs/ToggleBar';

import TimeBudgetBar from '/client/components/charts/Tides/TimeBudgetBar.jsx';


import { min2hr, percentOf, percentOverUnder } from '/client/utility/Convert';

const TimeExtendChunk = ({ b, rapid, isDebug }) =>	{
  
  const [ rapidTide, rapidTideSet ] = useState(false);
  
  const [ conversion, conversionSet] = useState('hours');
  
  useEffect( ()=>{
    
  
  
  const rapidStart = moment(rapid.createdAt);
  const rapidEnd = rapid.closedAt ? moment(rapid.closedAt) : moment();
  
  
  
  const tideBween = b.tide.filter( t => 
                        moment(t.startTime).isBetween(rapidStart, rapidEnd) ||
                        ( t.stopTime &&
                        moment(t.stopTime).isBetween(rapidStart, rapidEnd) ) );
                        
  rapidTideSet(tideBween);
  
  
  
  
  }, []);
  
  
  
  
  
  
  
  const totalSTbyPeople = ()=> {
    let totalTimeNum = 0;
    let peopleTime = [];
    let usersNice = [];
    if(!rapidTide) {
      null;
    }else{
      const usersGrab = Array.from(rapidTide, x => x.who );
      usersNice = [...new Set(usersGrab)];
      
      for(let ul of usersNice) {
        let userTimeNum = 0;
        const userTide = rapidTide.filter( x => x.who === ul );
        for(let bl of userTide) {
          const mStart = moment(bl.startTime);
          const mStop = !bl.stopTime ? moment() : moment(bl.stopTime);
          const block = moment.duration(mStop.diff(mStart)).asMinutes();
          totalTimeNum = totalTimeNum + block;
          userTimeNum = userTimeNum + block;
        }
        const userTime = Math.round( userTimeNum );
        peopleTime.push({
          uID: ul,
          uTime: userTime
        });
      }
    }
    const totalTime = Math.round( totalTimeNum );
    
    return { totalTime, peopleTime };
  };
  
  
  /////////////////////////////////
  
  
  const totalsCalc = totalSTbyPeople();

  const totalQuoteMinutes = rapid.timeBudget;
  
  const totalQuoteAs = conversion === 'minutes' ? 
                        Math.round(totalQuoteMinutes) :
                        min2hr(totalQuoteMinutes);
  
  const totalTideMinutes = totalsCalc.totalTime;
  const totalTideAs = conversion === 'minutes' ? 
                        Math.round(totalTideMinutes) :
                      conversion === 'percent' ?
                        percentOf(totalQuoteMinutes, totalTideMinutes) :
                        min2hr(totalTideMinutes);
                        
  const quote2tide = totalQuoteMinutes - totalTideMinutes;
  const bufferNice = Math.abs(quote2tide);
  
  const bufferAs = conversion === 'minutes' ? 
                    bufferNice :
                   conversion === 'percent' ?
                    Math.abs(percentOverUnder(totalQuoteMinutes, totalTideMinutes)) :
                    min2hr(bufferNice);
  
  const bufferMessage = quote2tide < 0 ?
    "exceeding" : "remaining";
  
  const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
  const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
  
  isDebug && 
  console.log({
    totalQuoteMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });

  const totalPeople = totalsCalc.peopleTime;
  const tP = totalPeople.length;
  
  return(
    <div className='flxGrow startSelf max400'>
      <h3>{rapid.rapid}</h3>
      
      
      
      <ToggleBar
        toggleOptions={['hours', 'minutes', 'percent']}
        toggleVal={conversion}
        toggleSet={(e)=>conversionSet(e)}
      />
      
  
     

          <div className='numFont'>
            <TimeBudgetBar a={totalTideMinutes} b={totalLeftMinutes} c={totalOverMinutes} />
            
            <p className='bigger'
              >{totalQuoteAs} <i className='med'>{conversion === 'minutes' ? 'minutes' : 'hours'} budgeted</i>
            </p>
            
            <p className='bigger'
              >{totalTideAs} <i className='med'>{conversion} logged</i>
            </p>
            
            <p className='bigger' 
              >{bufferAs} <i className='med'>{conversion} {bufferMessage}</i>
            </p>
            
          </div>
        
          <div className='numFont'>
            <TimeBudgetBar a={tP} b={0} c={0} />
            <dl className='readlines'>
              {totalPeople.map((per, ix)=>{
                if(per.uTime > 0) {
                  const timeAs = conversion === 'minutes' ? per.uTime :
                                  conversion === 'percent' ?
                                  percentOf(totalTideMinutes, per.uTime) :
                                  min2hr(per.uTime);
                  return( 
                    <dt 
                      key={ix}
                      className='rightRow doJustWeen'
                    ><i className='big gapR'><UserNice id={per.uID} /></i>
                    <i className='grayT'> {timeAs} {conversion}</i></dt> 
              )}})}
            </dl>
          </div>
        
          
    </div>  
  );
};

export default TimeExtendChunk;