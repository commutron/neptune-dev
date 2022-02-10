import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice';
import { CalcSpin } from '/client/components/tinyUi/Spin';
import ToggleBar from '/client/components/smallUi/Tabs/ToggleBar';

import QuoteTimeBudget from '/client/components/forms/QuoteTimeBudget';
import TimeBudgetBar from '/client/components/charts/Tides/TimeBudgetBar';
import TimeSplitBar from '/client/components/charts/Tides/TimeSplitBar';

import TimeBlocksRaw from './TimeBlocksRaw';

import { splitTidebyPeople } from '/client/utility/WorkTimeCalc';
import { min2hr, percentOf, percentOverUnder } from '/client/utility/Convert';

const TimeBudgetsChunk = ({
  tideWall, b, addTime, 
  conversion, conversionSet, plus, plusSet,
  isDebug
}) =>	{
  
  const [ branchTime, branchTimeSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('assembleBranchTime', b.batch, (err, reply)=>{
      err && console.log(err);
      reply && branchTimeSet( reply );
    });
  }, []);
  
  const totalsCalc = splitTidebyPeople(b.tide);

  const qtBready = !b.quoteTimeBudget ? false : true;
  const qtB = qtBready && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  
  const totalBudgetMinutes = !plus ? Number(qtB) : Number(qtB) + Number(addTime);
  const totalBudgetAs = conversion === 'minutes' ? 
                        Math.round(totalBudgetMinutes) :
                        min2hr(totalBudgetMinutes);
  
  const extraAs = conversion === 'minutes' ? 
                    Math.round(Number(addTime)) :
                    min2hr(Number(addTime));
  
  const totalMessage = conversion === 'minutes' ? 'minutes' : 'hours';
  
  const totalTideMinutes = totalsCalc.totalTime;
  const totalTideAs = conversion === 'minutes' ? 
                      Math.round(totalTideMinutes) :
                      conversion === 'percent' ?
                        percentOf(totalBudgetMinutes, totalTideMinutes) :
                        min2hr(totalTideMinutes);
     
  const quote2tide = totalBudgetMinutes - totalTideMinutes;
  const bufferNice = Math.round(Math.abs(quote2tide));
  
  const bufferAs = conversion === 'minutes' ? 
                   bufferNice :
                   conversion === 'percent' ?
                    Math.abs(percentOverUnder(totalBudgetMinutes, totalTideMinutes)) :
                    min2hr(bufferNice);
  
  const bufferMessage = quote2tide < 0 ? "exceeding" : "remaining";
  
  const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
  const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
  
  isDebug && console.log({
    totalBudgetMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });

  const totalPeople = totalsCalc.peopleTime;
  const tP = totalPeople.length;
  
  return(
    <div>
      <ToggleBar
        toggleIcons={['𝗛𝗿', '𝗠𝗻', 
          <n-fa1><i className='fas fa-percentage fa-fw'></i></n-fa1>, 
          <n-fa2><i className='fas fa-bars fa-fw'></i></n-fa2>
        ]}
        toggleOptions={[ 
          'hours','minutes','percent','raw records'
        ]}
        toggleVal={conversion}
        toggleSet={(e)=>conversionSet(e)}
      />
      
      {!moment(b.createdAt).isAfter(tideWall) && 
        <div className='big'>
          <p className='orangeT'
          >** This legacy {Pref.xBatch} was created before Start-Stop was enacted. 
          <br />Totals may not be acurate
          </p>
        </div>}
      
      {conversion === 'raw records' ?
        <TimeBlocksRaw 
          batch={b.batch}
          tide={b.tide}
          lockOut={b.lock}
          isDebug={isDebug} />
      : 
      <div className='space'>
        <div className='containerE'>
          <div className='oneEcontent numFont'>
            <TimeBudgetBar a={totalTideMinutes} b={totalLeftMinutes} c={totalOverMinutes} />
            
            <p className='bigger line1x'
              >{totalBudgetAs} <i className='med'>{totalMessage} budgeted</i>
            </p>
            {addTime > 0 && 
              <div className='middle'>
                <input
                  type='checkbox'
                  className='minHeight'
                  defaultChecked={plus}
                  onChange={()=>plusSet(!plus)} 
                /><i className='small fade'
                  >Including {extraAs} {totalMessage} of extra time</i>
              </div>
            }
              
            <p className='bigger line1x'
              >{totalTideAs} <i className='med'>{conversion} logged</i>
            </p>
            
            <p className='bigger line1x' 
              >{bufferAs} <i className='med'>{conversion} {bufferMessage}</i>
            </p>
            
            <div className='vmargin'>
              <QuoteTimeBudget 
                bID={b._id} 
                lockOut={b.lock} />
            </div>
          </div>
      
          <div className='twoEcontent numFont'>
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
                    ><i className='gapR'><UserNice id={per.uID} /> </i>
                      <i className='grayT rightText medSm'
                      > {timeAs} {conversion}</i>
                    </dt> 
              )}})}
            </dl>
          </div>
      
          <div className='threeEcontent numFont'>
            
            {!branchTime ? <CalcSpin />
            :
              branchTime.length === 0 ? <div className='small'>n/a</div>
              :
                <div>
                  <TimeSplitBar
                    title={Pref.branches}
                    nums={branchTime}
                    colour='blue' />
                  <dl className='readlines'>
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
                            className='rightRow doJustWeen'
                          ><i className='cap'>{br.x}</i>
                            <i className='grayT rightText medSm'
                            > {timeAs} {conversion}</i>
                          </dt> 
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
      }
    </div>  
  );
};

export default TimeBudgetsChunk;