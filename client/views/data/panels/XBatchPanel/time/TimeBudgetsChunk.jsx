import React, { useState, useEffect } from 'react';
import Pref from '/public/pref.js';
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
  isDebug, app
  // brancheS
}) =>	{
  
  const [ branchTime, branchTimeSet ] = useState(false);
  const [ qtZero, showQtZero ] = useState(false);

  useEffect( ()=>{
    Meteor.call('collateBranchTime', b.batch, (err, reply)=>{
      err && console.log(err);
      reply && branchTimeSet( reply );
    });
  }, []);
  
  const totalsCalc = splitTidebyPeople(b.tide);

  const qtBready = !b.quoteTimeBudget ? false : true;
  const qtBudget = qtBready && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  
  const totalBudgetMinutes = !plus ? Number(qtBudget) : Number(qtBudget) + Number(addTime);
  
  const timeAs = (dur)=> {
    return conversion === 'minutes' ? Math.round(dur) :
            conversion === 'percent' ?
            ( percentOf(totalBudgetMinutes, dur) ).toFixed(2, 10) :
            min2hr(dur);
  };
  
  const totalPeople = totalsCalc.peopleTime;
  const tP = totalPeople.length;
  
  const oldTaskTimesArray = b.quoteTimeBreakdown ? b.quoteTimeBreakdown.timesAsMinutes : [];
  
  const cnv = conversion === 'minutes' ? 'min' : conversion === 'percent' ? '%' : 'hrs';
  
  return(
    <div>
      <div className='centreRow comfort'>
        <div className='vwrap beside'>
          <QuoteTimeBudget
            bID={b._id}
            bQuantity={b.quantity || 0}
            qtBudget={qtBudget}
            qtCycles={b.quoteTimeCycles || []}
            lockOut={b.lock} 
            app={app}
          />
          <em>{b.quoteTimeCycles ? "QT Time (2025) Enabled" : "Legacy Task Time Estimates Used"}</em>
        </div>
        
        <span className='rowWrap'>Zero Sub-Tasks
          <label className='beside gapR'>
            <input
              type='checkbox'
              className='minHeight medSm'
              defaultChecked={qtZero}
              onChange={()=>showQtZero(!qtZero)} 
            /></label>
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
        </span>
      </div>
      
      {b.createdAt < tideWall &&
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
          <TotalTide
            totalBudgetMinutes={totalBudgetMinutes}
            totalTime={totalsCalc.totalTime}
            conversion={conversion}
            plus={plus}
            plusSet={plusSet}
            addTime={addTime}
            isDebug={isDebug}
          />
      
          <div className='twoEcontent numFont'>
            <TimeBudgetBar a={tP} b={0} c={0} />
            <dl className='readlines'>
              {totalPeople.map((per, ix)=>{
                if(per.uTime > 0) {
                  return( 
                    <dt 
                      key={ix}
                      className='rightRow doJustWeen breaklines'
                    ><i className='gapR'><UserNice id={per.uID} /> </i>
                      <i className='grayT rightText medSm'
                      > {timeAs(per.uTime)} {cnv}</i>
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
                  chunks={branchTime.map(b=>b.brTotal>0)}
                  colour='blue'
                />
                <dl className='readlines'>
                  <QuotedTaskBreakdown
                    branchTime={branchTime}
                    qtTaskTimesArray={b.quoteTimeCycles || oldTaskTimesArray} 
                    timeAs={timeAs}
                    cnv={cnv}
                    qtZero={qtZero}
                    mlt='Includes Multi-tasking'
                    app={app}
                    quantity={b.quantity}
                  />
                </dl>
              </div>
              }
          </div>
        </div>
        
        <TideDetails 
          qtBudget={qtBudget}
          qtCycles={b.quoteTimeCycles}
        />
      </div>
      }
    </div>  
  );
};

export default TimeBudgetsChunk;

const TotalTide = ({ totalBudgetMinutes, totalTime, conversion, plus, plusSet, addTime, isDebug })=> {
  
  const totalBudgetAs = conversion === 'minutes' ? 
                        Math.round(totalBudgetMinutes) :
                        min2hr(totalBudgetMinutes);
  
  const extraAs = conversion === 'minutes' ? 
                    Math.round(Number(addTime)) :
                    min2hr(Number(addTime));
                    
  const totalMessage = conversion === 'minutes' ? 'minutes' : 'hours';

  const totalTideMinutes = totalTime;
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
                    
  const bufferMessage = quote2tide < 0 ? "exceeding quote" : "of quoted remaining";
  
  const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
  const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
  
  isDebug && console.log({
    totalBudgetMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });
  
  return(
    <div className='oneEcontent numFont'>
      <TimeBudgetBar 
        a={totalTideMinutes} 
        b={totalLeftMinutes} 
        c={totalOverMinutes}
      />
      
      <p className='bigger line1x'
        >{totalTideAs} <i className='med'>{conversion} logged</i>
      </p>
      
      <p className='bigger line1x'
        >{totalBudgetAs} <i className='med'>{totalMessage} quoted</i>
      </p>
      {addTime > 0 && 
        <div className='beside'>
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
        >{bufferAs} <i className='med'>{conversion} {bufferMessage}</i>
      </p>
    </div>
  );
};

const QuotedTaskBreakdown = ({ 
  branchTime, qtTaskTimesArray, timeAs, cnv, qtZero, mlt, app, quantity 
})=> {
  
  const mltIcn = <i className='fa-regular fa-clone fa-xs tealT gapL'></i>;
  
  return(
    <div>
      {branchTime.map((br, ix)=>{
        if(qtZero || br.brTotal > 0) {
          return( 
            <dl key={ix} className='breaklines'>
              <dt title={`${Math.round(br.brTotal)} minutes`} className='rightRow doJustWeen'
                ><i className='cap bold'>{br.branch}{br.brMulti && mltIcn}</i>
                <span className='grayT rightText medSm'
                  ><i> {timeAs(br.brTotal)}</i>{/*}<n-sm>{br.brCap > 0 && "/"+timeAs(brCap)}</n-sm>*/} {cnv}</span>
              </dt>
              {br.brQts.map( (qt)=> {
                const qtedData = qtTaskTimesArray.find( x => x[0] === qt.key );
                let qtapp = !qtedData ? null : app.qtTasks.find( q => q.qtKey === qt.key );
                let qtname = qtapp?.qtTask || qt.qt;
                let qtnum = !qtapp ? null : qtapp.fixed ? qtedData[1] : ( qtedData[1] * (quantity || 0) );
                
                if((qt.qt === 'unquoted' && qt.qtTotal === 0) || (!qtZero && qt.qtTotal === 0)) {
                  return null;
                }else{
                  return(
                    <dl key={ix+'qt'+qt.key} className='breaklines'>
                      {qt.qt === 'unquoted' && br.brTotal === qt.qtTotal ? null :
                        <dd 
                          title={`${Math.round(qt.qtTotal)} minutes`}
                          className='rightRow doJustWeen'
                          style={{margin: '5px 0 5px 12px'}}
                        ><i className='cap'>{qtname}{qt.qtMulti && mltIcn}</i>
                          {TimeElm(qtnum, qt.qtTotal, timeAs, cnv)}
                        </dd>
                      }
                      {qt.qtSubs.map( (qtsb, ixzz)=> {
                        const lgcyQe = !qtapp ? qtTaskTimesArray.find( x => x[0] === br.branch+"|"+qtsb.sub ) : null;
                        const lgcyQn = lgcyQe?.[1] || null;
                        if(qtZero || qtsb.sum > 0) {
                          return(
                            <dd 
                              key={ix+'qt'+qt.key+'sub'+ixzz}
                              title={`${Math.round(qtsb.sum)} minutes`}
                              className='rightRow doJustWeen medSm'
                            ><i className='cap'>{qtsb.sub}{qtsb.w && mltIcn}</i>
                              {TimeElm(lgcyQn, qtsb.sum, timeAs, cnv)}
                            </dd>
                          );
                        }
                      })}
                    </dl>
                )}})}
            </dl>
          );
        }
      })}
    </div>
  );
};

const TimeElm = (max, total, timeAs, cnv)=> (
  <span className='rightText grayT medSm'>
    <i className={max && total > max ? 'redT' : ''}> {timeAs(total)}</i><n-sm>{max && "/"+timeAs(max)}</n-sm> {cnv}
  </span>
);

const TideDetails = ({ qtCycles, qtBudget })=> (
  <details className='footnotes'>
    <summary>Calculation Details</summary>
    <p className='footnote'>Sum of time blocks are each rounded to their nearest minute</p>
    <p className='footnote'>
      Logged time is recorded to the second and is displayed to the nearest minute.
    </p>
    <p className='footnote'>
      Update quoted time budget in hours to 2 decimal places.
    </p>
    <p className='footnote'><i className='fa-regular fa-clone tealT gapR'></i>Indicates the user was clocked into multiple tasks at once. The durration is evenly split between the tasks.</p>
    {qtCycles ?
    <p className='footnote'>
      Post fall 2025, task time is sorted into QT Cycle time; groups that corospond to the order quote via a breakdown on the {Pref.widget} process flow. 
    </p>
    :
    <p className='footnote'>
      Pre fall 2025, task time is calculated by {Pref.branch}. When subtask was not logged, Neptune attempts to derive the task from other user interaction.
    </p>
    }
    <dl className='monoFont'>
      <dd>minutes_quoted = {qtBudget}</dd>
      <dd>minutes / list length</dd>
    </dl>
  </details>
);