import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import ToggleBar from '/client/components/bigUi/ToolBar/ToggleBar';

import { TimeBudgetUpgrade, WholeTimeBudget } from '/client/components/forms/QuoteTimeBudget.jsx';
import TimeBudgetBar from '/client/components/charts/Tides/TimeBudgetBar.jsx';
import TimeSplitBar from '/client/components/charts/Tides/TimeSplitBar.jsx';

import { min2hr, percentOf, percentOverUnder } from '/client/utility/Convert';

const TimeBudgetsChunk = ({
  a, b, isX,
  totalUnits, isDebug
}) =>	{
  
  const [ branchTime, branchTimeSet ] = useState(false);
  
  const [ conversion, conversionSet] = useState('hours');
  
  useEffect( ()=>{
    Meteor.call('assembleBranchTime', b._id, (err, reply)=>{
      err && console.log(err);
      reply && branchTimeSet( reply );
    });
  }, []);
  
  
  const totalSTbyPeople = ()=> {
    let totalTimeNum = 0;
    let peopleTime = [];
    let usersNice = [];
    if(!b.tide) {
      null;
    }else{
      const usersGrab = Array.from(b.tide, x => x.who );
      usersNice = [...new Set(usersGrab)];
      
      for(let ul of usersNice) {
        let userTimeNum = 0;
        const userTide = b.tide.filter( x => x.who === ul );
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
  
  const totalsCalc = totalSTbyPeople();

  const qtBready = !b.quoteTimeBudget ? false : true;
  const qtB = qtBready && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  
  const totalQuoteMinutes = qtB || 0;
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
    "exceeding quoted" : "remaining of quoted";
  
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
    <div className=''>
      <ToggleBar
        toggleOptions={['hours', 'minutes', 'percent']}
        toggleVal={conversion}
        toggleSet={(e)=>conversionSet(e)}
      />
      
      <div className='big'>
        {!moment(b.createdAt).isAfter(a.tideWall) && 
          <p className='orangeT'>{` ** This ${Pref.batch} was created before \n
            Start-Stop was enacted. Totals may not be acurate`} 
          </p>}
      </div>
        
      <div className='space containerE'>
        
        <div className='oneEcontent numFont'>
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
          
          <div className='vmargin'>
            {!qtBready ? <TimeBudgetUpgrade bID={b._id} isX={isX} /> :
              <WholeTimeBudget bID={b._id} isX={isX} /> }
          </div>
          
        </div>
        
        <div className='twoEcontent numFont'>
          <TimeBudgetBar a={tP} b={0} c={0} />
          <dl>
            {totalPeople.map((per, ix)=>{
              if(per.uTime > 0) {
                const timeAs = conversion === 'minutes' ? per.uTime :
                                conversion === 'percent' ?
                                percentOf(totalTideMinutes, per.uTime) :
                                min2hr(per.uTime);
                return( 
                  <dt 
                    key={ix}
                    className='comfort middle'
                  ><i className='big'><UserNice id={per.uID} /></i>
                  <i className='grayT'> {timeAs} {conversion}</i></dt> 
            )}})}
          </dl>
          
        </div>
        
        <div className='threeEcontent numFont'>
          
          {!branchTime ?
            <CalcSpin />
          :
            branchTime.length === 0 ?
              <div className='small'>n/a</div>
            :
              <div>
                <TimeSplitBar
                  title={Pref.branches}
                  nums={branchTime}
                  colour='blue' />
                <dl>
                  {branchTime.map((br, ix)=>{
                    if(br.y > 0) {
                      const timeAs = conversion === 'minutes' ? 
                                      Math.round(br.y) :
                                     conversion === 'percent' ?
                                      percentOf(totalTideMinutes, br.y) :
                                      min2hr(br.y);
                      return( 
                        <dt
                          key={ix}
                          title={`${Math.round(br.y)} minutes`}
                          className='comfort middle'
                        ><i className='big cap'>{br.x}</i>
                        <i className='grayT'> {timeAs} {conversion}</i></dt> 
                  )}})}
                </dl>
              </div>
            }
        
        </div>
        

      </div>
        
      
      <details className='footnotes'>
        <summary>Calculation Details</summary>
        <p className='footnote'>Sum of time blocks are each rounded to their nearest minute</p>
        <p className='footnote'>
          Logged time is recorded to the second and is displayed to the nearest minute.
        </p>
        <p className='footnote'>
          Update quoted time budget in hours to 2 decimal places.
        </p>
        <p className='footnote'>
          {Pref.branch} time is not logged but derived. If a block of time is attributed 
          to multiple {Pref.branches} then the time block is divided by the number of {Pref.branches}.
        </p>
        <dl className='monoFont'>
          <dd>minutes_quoted = {qtB}</dd>
          <dd>minutes / list length</dd>
        </dl>
      </details>
      
              
    </div>  
  );
};

export default TimeBudgetsChunk;