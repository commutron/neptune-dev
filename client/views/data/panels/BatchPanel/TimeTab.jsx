import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

import ProgLayerBurndown, { ProgLayerBurndownExplain } from '/client/components/charts/ProgLayerBurndown.jsx';
import TimeBudgetBar from '/client/components/charts/TimeBudgetBar/TimeBudgetBar.jsx';
import EventsList from '/client/components/smallUi/EventsList.jsx';
import TimeBlocksRaw from './TimeBlocksRaw.jsx';

const TimeTab = ({
  a, b, user, 
  done, allDone,
  riverFlow, riverAltFlow
}) =>	{


///////////////////////////////////////
    const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
    let allthetimes = [];
    if(proto) {
      for(let item of b.items) {
        for(let entry of item.history) {
          if(entry.type === 'inspect' && entry.good === true) {
            allthetimes.push({
              key: entry.key,
              step: entry.step,
              time: entry.time,
              who: entry.who,
            });
          }
        }
      }
      const cronoTimes = allthetimes.sort((x1, x2)=> {
                          if (x1.time < x2.time) { return -1 }
                          if (x1.time > x2.time) { return 1 }
                          return 0;
                        });
      let sortedTimes = [];
      for(let step of riverFlow || []) {
        if(step.type === 'inspect') {
          const thesetimes = cronoTimes.filter( x => x.key === step.key );
          sortedTimes.push({
            step: step.step,
            entries: thesetimes
          });
        }
      }
    }
////////////////////////////////////////

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
  
  const totalQuoteMinutes = totalsCalc.totalTime;
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
  
  console.log({
    totalQuoteMinutes,
    totalTideMinutes,
    totalLeftMinutes,
    totalOverMinutes
  });

  const totalPeople = [...totalsCalc.totalPeople];
  
  
  return(
    <div className='space3v'>
      <div className='vmargin space aFrameContainer'>
        
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
          <TimeBudgetBar a={0} b={1} c={0} />
          <p>
            <span className='bigger'>{totalPeople.length}</span> 
            {totalPeople.length === 1 ? ' person' : ' people'}
          </p>
          <ul>
            {totalPeople.map((per, ix)=>{
              return( <li key={ix}><UserNice id={per} /></li> );
            })}
          </ul>
        </div>

      </div>
        
      <div className='dropCeiling vmargin space'>
        <ProgLayerBurndown
          id={b._id}
          start={b.start}
          floorRelease={b.floorRelease}
          end={b.finishedAt}
          flowData={riverFlow || []}
          itemData={b.items.filter( x => x.alt === 'no' || x.alt === false )}
          title='Progress Burndown' />
                
        {b.riverAlt !== false &&  
          <ProgLayerBurndown
            id={b._id}
            start={b.start}
            floorRelease={b.floorRelease}
            end={b.finishedAt}
            flowData={riverAltFlow || []}
            itemData={b.items.filter( x => x.alt === 'yes' )}
            title='Alt Progress Burndown' />}
              
        <ProgLayerBurndownExplain />
      </div>
      
      <div className='dropCeiling vmargin space'>
        <h3 className='centreText'>Events</h3>  
        <EventsList events={b.events} />
      </div>
      
      {proto &&
        <div className='vmargin space'>
          <TimeBlocksRaw tide={b.tide} />
        </div>
      }
              
    </div>  
  );
};

export default TimeTab;


/*<div>
  <ol>
    {sortedTimes.map( (step, index)=>{
      return(
        <ol key={index}>
          <b>{step.step} inspect</b>
          {step.entries.map( (ding, inx)=>{
            return(
              <li key={inx}>
                - {ding.time.toString()} - 
                - <AnonyUser id={ding.who} />
              </li> 
          )})}
        </ol>
    )})}
  </ol>
</div>*/