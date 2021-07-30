import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
// import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import ToggleBar from '/client/components/smallUi/Tabs/ToggleBar';

import TimeBudgetBar from '/client/components/charts/Tides/TimeBudgetBar.jsx';

import { splitTidebyPeople } from '/client/utility/WorkTimeCalc';
import { min2hr, percentOf, percentOverUnder } from '/client/utility/Convert';

const TimeExtendChunk = ({ b, rapid, conversion, conversionSet, isDebug }) =>	{
  
  const [ rapidTide, rapidTideSet ] = useState(false);
  
  useEffect( ()=>{
    const rapidStart = moment(rapid.createdAt);
    const rapidEnd = rapid.closedAt ? moment(rapid.closedAt) : moment();
  
    const tideBween = b.tide.filter( t => 
                        moment(t.startTime).isBetween(rapidStart, rapidEnd) ||
                        ( t.stopTime &&
                        moment(t.stopTime).isBetween(rapidStart, rapidEnd) ) );
                        
    rapidTideSet(tideBween);
  }, []);
  
  const totalsCalc = splitTidebyPeople(rapidTide);

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
  
  const bufferMessage = quote2tide < 0 ? "exceeding" : "remaining";
  
  const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
  const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
  
  isDebug && console.log({
    totalQuoteMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });

  const totalPeople = totalsCalc.peopleTime;
  const tP = totalPeople.length;
  
  return(
    <div className='flxGrow startSelf max500'>
      <h3>{rapid.rapid}</h3> 
      
      <div className='split gapsC'>
      
        <div className='numFont'>
          <TimeBudgetBar 
            a={totalTideMinutes} 
            b={totalLeftMinutes} 
            c={totalOverMinutes}
            thin={true} />
          
          <p className='medBig line1x'
            >{totalQuoteAs} <i className='med'>{conversion === 'minutes' ? 'minutes' : 'hours'} budgeted</i>
          </p>
          
          <p className='medBig line1x'
            >{totalTideAs} <i className='med'>{conversion} logged</i>
          </p>
          
          <p className='medBig line1x' 
            >{bufferAs} <i className='med'>{conversion} {bufferMessage}</i>
          </p>
          
        </div>
        
        <div className='numFont'>
          <TimeBudgetBar a={tP} b={0} c={0} thin={true} />
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
                  ><i className='gapR'><UserNice id={per.uID} /> </i>
                    <i className='grayT rightText medSm'
                    > {timeAs} {conversion}</i>
                  </dt> 
            )}})}
          </dl>
        </div>
      </div>
    </div>  
  );
};

export default TimeExtendChunk;