import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Pref from '/client/global/pref.js';

import ProgLayerBurndown from '/client/components/charts/ProgLayerBurndown.jsx';
import { AnonyUser } from '/client/components/smallUi/UserNice.jsx';

const TimeTab = ({
  a, b, user, 
  done, allDone,
  riverFlow, riverAltFlow
}) =>	{


///////////////////////////////////////
    const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
    let allthetimes = [];
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
    for(let step of riverFlow) {
      if(step.type === 'inspect') {
        const thesetimes = cronoTimes.filter( x => x.key === step.key );
        sortedTimes.push({
          step: step.step,
          entries: thesetimes
        });
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
  const totals = totalST();
  const totalMinutes = totals.totalTime;
  const totalPeople = [...totals.totalPeople];
  
  return(
    <div className='space3v'>
      <div className='vmargin space'>
        
        <div className='big'>     
          <p className='medBig'>Total time recorded with Start-Stop:</p>
          <p>sum of time blocks, each rounded to their nearest minute</p>
          {!moment(b.createdAt).isAfter(a.tideWall) && 
            <p className='orangeT'>{` ** This ${Pref.batch} was created before \n
              Start-Stop was enacted. Total may not be acurate`} 
            </p>}
          <hr />
          <p><span className='bigger'>{totalMinutes}</span> minutes</p>
          <p>or</p>
          <p><span className='bigger'>{moment.duration(totalMinutes, "minutes").asHours()}</span> hours</p>
          <p>with</p>
          <p>
            <span className='bigger'>{totalPeople.length}</span> 
            {totalPeople.length === 1 ? ' person' : ' people'}
          </p>
        </div>

                
      </div>
        
      <div className='dropCeiling vmargin space'>
        <ProgLayerBurndown
          id={b._id}
          start={b.start}
          floorRelease={b.floorRelease}
          end={b.finishedAt}
          flowData={riverFlow}
          itemData={b.items.filter( x => x.alt === 'no' || x.alt === false )}
          title='Progress Burndown' />
                
        {b.riverAlt !== false &&  
          <ProgLayerBurndown
            id={b._id}
            start={b.start}
            floorRelease={b.floorRelease}
            end={b.finishedAt}
            flowData={riverAltFlow}
            itemData={b.items.filter( x => x.alt === 'yes' )}
            title='Alt Progress Burndown' />}
              
        <details className='footnotes'>
          <summary>Chart Details</summary>
          <p className='footnote'>
            The X axis is the number of serialized items remaining.
          </p>
          <p className='footnote'>
            The Y axis starts with the batch creation date and ends with 
            either today or the batch complete day. Weekends are skipped 
            entirely.
          </p>
          <p className='footnote'>
            A step that was added mid-run might not reach zero because 
            finished items would have skipped recording that step.
          </p>
        </details>
      </div>
      
      <div className='vmargin space'>
                
        <ul className='numFont'>
          {!b.tide ?
            <p className='centreText'>start/stop not enabled</p>
            :
            b.tide.map( (mov, index)=>{
              const mStart = moment(mov.startTime);
              const mStop = mov.stopTime ? moment(mov.stopTime) : moment();
              return(
                <li key={index} title={mov.tKey}>
                  <AnonyUser id={mov.who} />
                  - {moment(mStart).format()}
                  - {moment(mStop).format()}
                  - {Math.round( moment.duration(mStop.diff(mStart)).asMinutes() )} minutes
                </li>
            )})}
          </ul>
                
                
      </div>
      
              
        {proto ?
        <div>
          <ol>
            {sortedTimes.length === 0 ?
            <p className='centreText'>no inspections</p>
            :
            sortedTimes.map( (step, index)=>{
              return(
                <ol key={index}>
                  <b>{step.step} inspect</b>
                  {step.entries.map( (ding, inx)=>{
                    return(
                      <li key={inx}>
                        - {ding.time.toString()} - 
                        - <AnonyUser id={ding.who} />
                      </li> );
                  })}
                </ol>
            )})}
          </ol>
        </div>
      : <div><p className='centreText'>raw time data available for on the "nightly" track</p></div>}
      
              
    </div>  
  );
};

export default TimeTab;