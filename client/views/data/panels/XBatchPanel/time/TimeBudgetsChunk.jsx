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

  useEffect( ()=>{
    if(b.quoteTimeCycles) {
      Meteor.call('collateBranchTime', b.batch, (err, reply)=>{
        err && console.log(err);
        reply && branchTimeSet( reply );
      });
    }else{
      Meteor.call('assembleBranchTime', b.batch, (err, reply)=>{
        err && console.log(err);
        reply && branchTimeSet( reply );
      });
    }
  }, []);
  
  const totalsCalc = splitTidebyPeople(b.tide);

  const qtBready = !b.quoteTimeBudget ? false : true;
  const qtBudget = qtBready && b.quoteTimeBudget.length > 0 ? 
                b.quoteTimeBudget[0].timeAsMinutes : 0;
  
  const totalBudgetMinutes = !plus ? Number(qtBudget) : Number(qtBudget) + Number(addTime);
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
  
  const bufferMessage = quote2tide < 0 ? "exceeding budget" : "of budget remaining";
  
  const totalLeftMinutes = quote2tide < 0 ? 0 : bufferNice;
  const totalOverMinutes = quote2tide < 0 ? bufferNice : 0;
  
  isDebug && console.log({
    totalBudgetMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });
  
  const timeAs = (dur)=> {
    return conversion === 'minutes' ? Math.round(dur) :
            conversion === 'percent' ?
            ( percentOf(totalBudgetMinutes, dur) ).toFixed(2, 10) :
            min2hr(dur);
  };
  
  const totalPeople = totalsCalc.peopleTime;
  const tP = totalPeople.length;
  
  const qtTaskTimesArray = b.quoteTimeCycles || [];
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
              >{totalBudgetAs} <i className='med'>{totalMessage} budgeted</i>
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
                  chunks={branchTime.map(b=>b.y>0)}
                  colour='blue'
                />
                <dl className='readlines'>
                  {!qtTaskTimesArray ?
                    <LegacyTaskBreakdown 
                      branchTime={branchTime}
                      qtbB={oldTaskTimesArray} 
                      timeAs={timeAs}
                      cnv={cnv}
                      mlt='Includes Multi-tasking'
                    />
                  :
                  branchTime.map((br, ix)=>{
                    if(br.y > 0) {
                      const brData = qtTaskTimesArray.filter( x => x[0].includes(br.x) );
                        const brTotal = brData.reduce((a,b)=> a + b[1], 0);
                        return( 
                          <dl key={ix} className='breaklines'>
                            <dt
                              title={`${Math.round(br.y)} minutes`}
                              className='rightRow doJustWeen'
                            ><i className='cap'
                              >{br.x}{br.w && 
                                <i className='fa-regular fa-clone fa-sm tealT gapL'></i>}
                              </i>
                              <span className='grayT rightText medSm'
                              ><i className={brTotal > 0 && br.y > brTotal ? 'redT' : '' }> {timeAs(br.y)}</i><n-sm>{brTotal > 0 && "/"+timeAs(brTotal)}</n-sm> {cnv}</span>
                            </dt>
                            {br.q && br.q.length > 0 ? br.q.map( (qt, ixz)=> {
                              const sbQ = qtTaskTimesArray.find( x => x[0] === qt.q );
                              let qtapp = sbQ ? app.qtTasks.find( q => q.qtKey === qt.q ) : null;
                              let qtname = qtapp?.qtTask || 'missing';
                              let mxQ = !qtapp ? null : qtapp.fixed ? sbQ[1] : ( sbQ[1] * (b.quantity || 0) );
                              return(
                                <dd 
                                  key={ix+'sub'+ixz}
                                  title={`${Math.round(qt.sum)} minutes`}
                                  className='rightRow doJustWeen'
                                ><i className='cap'>{qtname}{qt.w && 
                                   <i className='fa-regular fa-clone fa-xs tealT gapL'></i>}
                                 </i>
                                  <span className='rightText medSm grayT'
                                  ><i className={mxQ && qt.sum > mxQ ? 'redT' : '' }> {timeAs(qt.sum)}</i><n-sm>{mxQ && "/"+timeAs(mxQ)}</n-sm> {cnv}</span>
                                </dd>
                            )}) : null}
                          </dl>
                        );
                    }})}
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
          <p className='footnote'><i className='fa-regular fa-clone tealT gapR'></i>Indicates the user was clocked into multiple tasks at once. The durration is evenly split between the tasks.</p>
          {b.quoteTimeCycles ?
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
      </div>
      }
    </div>  
  );
};

export default TimeBudgetsChunk;

const LegacyTaskBreakdown = ({ branchTime, qtbB, timeAs, cnv, mlt })=> {
  return(
    <dl className='readlines'>
      {branchTime.map((br, ix)=>{
        if(br.y > 0) {
          const sbs = qtbB.filter( x => x[0].includes(br.x) );
          const sbt = sbs.reduce((a,b)=> a + b[1], 0);
          return( 
            <dl key={ix} className='breaklines'>
              <dt
                title={`${Math.round(br.y)} minutes`}
                className='rightRow doJustWeen'
              ><i className='cap'
                >{br.x}{br.w && 
                  <i className='fa-regular fa-clone fa-sm tealT gapL' title={mlt}></i>}
                </i>
                <span className='grayT rightText medSm'
                ><i className={sbt > 0 && br.y > sbt ? 'redT' : '' }> {timeAs(br.y)}</i><n-sm>{sbt > 0 && "/"+timeAs(sbt)}</n-sm> {cnv}</span>
              </dt>
              {br.z && br.z.length > 0 ? br.z.map( (zt, ixz)=> {
                const sbQ = qtbB.find( x => x[0] === br.x+"|"+zt.a );
                const mxQ = sbQ ? sbQ[1] : null;
                return(
                  <dd 
                    key={ix+'sub'+ixz}
                    title={`${Math.round(zt.b)} minutes`}
                    className='rightRow doJustWeen'
                  ><i className='cap'>{zt.a}{zt.w && 
                     <i className='fa-regular fa-clone fa-xs tealT gapL' title={mlt}></i>}
                   </i>
                    <span className='rightText medSm grayT'
                    ><i className={mxQ && zt.b > mxQ ? 'redT' : '' }> {timeAs(zt.b)}</i><n-sm>{mxQ && "/"+timeAs(mxQ)}</n-sm> {cnv}</span>
                  </dd>
              )}) : null}
            </dl>
          );
      }})}
    </dl>
  );
};