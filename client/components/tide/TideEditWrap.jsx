import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';

import { HolidayCheck } from '/client/utility/WorkTimeCalc.js';
import { min2hr } from '/client/utility/Convert';
import DayPieceBar from '/client/components/charts/Tides/DayPieceBar';
import TideBlockRow from '/client/components/tide/TideBlockRow';


const TideEditWrap = ({ 
  weekData, traceDT, updateData, 
  user, isDebug, 
  app, ancOptionS, brancheS 
})=> {
  
  const isSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  const [ doEditKey, enableEdit ] = useState(false);
  const [ doSplitKey, enableSplit ] = useState(false);
  
  useEffect(()=> {
    enableSplit(false);
  }, [doEditKey]);
  
  function editBlock(e) {
    enableEdit(false);
    const tideKey = e.tideKey;
    const newStart = Array.isArray(e.newStart) ? e.newStart[0] : false;
    const newStop = Array.isArray(e.newStop) ? e.newStop[0] : false;
    const taskIs = e.taskIs;
    const subtIs = e.subtIs;
    
    if(!tideKey || !newStart || !newStop) { 
      console.log([{tideKey, newStart, newStop}, 'data issue no call']);
    }else{
      Meteor.apply('editTideTimeBlock', 
        [ e.dbHome, tideKey, newStart, newStop, taskIs, subtIs ],
        { wait: true, noRetry: false },
        (err, asw)=>{
          err && console.log(err);
          if(asw === true) {
            updateData();
          }
      });
    }
  }
  function endBlock(e) {
    if(!e.tideKey) { 
      console.log([e.tideKey, 'data issue no call']);
    }else{
      Meteor.apply('stopTideTimeBlock', [ e.dbHome, e.tideKey ],
      { wait: true, noRetry: false },
      (err, asw)=>{
        err && console.log(err);
        if(asw === true) {
          updateData();
        }
      });
    }
  }
  function splitBlock(e) {
    enableEdit(false);
    const tideKey = e.tideKey;
    const newSplit = Array.isArray(e.tempSplit) ? e.tempSplit[0] : false;
    const stopTime = e.stopTime;

    if(!tideKey || !newSplit || !stopTime) { 
      console.log([{tideKey, newSplit, stopTime}, 'data issue no call']);
    }else{
      Meteor.apply('splitTideTimeBlock', [ e.dbHome, tideKey, newSplit, stopTime ],
       { wait: true, noRetry: false },
       (err, asw)=>{
        err && console.log(err);
        if(asw === true) {
          updateData();
        }
      });
    }
  }
  
  return(
    <tbody>
      {weekData.map( (blk, index)=>{
        const maint = blk.type === 'MAINT';

        const moreInfo = maint ? false : traceDT?.find( x => x.batch === blk.batch);
        const what = maint ? (blk.project?.split(" ~ ")?.[1]?.split("<*>")?.[0] || 'Scheduled')
                              + ' Service' : moreInfo?.isWhat.join(' ') || 'unavailable';
        const rad = maint ? null : moreInfo?.rad || null;
        
        const lastStart = weekData[index-1] && weekData[index-1].startTime;
        const lastStop = weekData[index+1] && weekData[index+1].stopTime;
        const nextStart = lastStart ? lastStart : false;
        
        if(index === 0 || moment(blk.startTime).isSame(lastStart, 'day') === false) {
          const newDayTime = moment(blk.startTime);
          const dayStart = newDayTime.clone().startOf('day').nextWorkingTime();
          const dayEnd = newDayTime.clone().endOf('day').lastWorkingTime();
          const restOfDay = weekData.filter( x => newDayTime.isSame(x.startTime, 'day') );
          const isHoliday = HolidayCheck( app.nonWorkDays, newDayTime);
          const dayDurr = Array.from(restOfDay, x => Math.round(x.durrAsMin) );
          const dayTotal = dayDurr.reduce((x,y)=>x+y,0);
          
          return(
            <Fragment key={index+blk.tKey}>
              <tr key={blk.startTime.toISOString()} className=' '>
                <th colSpan='7' className='noRightBorder line4x medBig leftText'
                  >{newDayTime.format('dddd MMMM Do')}
                  {isHoliday ? <span className=''> (Holiday)</span> : null}
                </th>
                <th title={`${dayTotal} minutes`}
                  ><n-num>{min2hr(dayTotal)}</n-num> <n-n>hrs</n-n></th>
              </tr>
              <tr>
                <th colSpan='8'>
                  <DayPieceBar
                    tideTimes={restOfDay}
                    dateTime={newDayTime}
                    regDayStart={dayStart}
                    regDayEnd={dayEnd}
                    app={app}
                    user={user} />
                </th>
              </tr>
              <TideBlockRow
                key={blk.tKey}
                describe={what}
                rad={rad}
                tideObj={blk}
                lastStop={lastStop}
                nextStart={nextStart}
                editKey={doEditKey}
                editMode={(e)=>enableEdit(e ? blk.tKey : false)}
                splitKey={doSplitKey}
                splitMode={(e)=>enableSplit(e ? blk.tKey : false)}
                setEdit={(e)=>editBlock(e)}
                setEnd={(e)=>endBlock(e)}
                setSplit={(e)=>splitBlock(e)}
                ancOptionS={ancOptionS}
                brancheS={brancheS}
                isSuper={isSuper}
                isDebug={isDebug} />
            </Fragment>
          );
        }else{
          return(
            <TideBlockRow
              key={blk.tKey}
              describe={what}
              rad={rad}
              tideObj={blk}
              lastStop={lastStop}
              nextStart={nextStart}
              editKey={doEditKey} 
              editMode={(e)=>enableEdit(e ? blk.tKey : false)}
              splitKey={doSplitKey}
              splitMode={(e)=>enableSplit(e ? blk.tKey : false)}
              setEdit={(e)=>editBlock(e)}
              setEnd={(e)=>endBlock(e)}
              setSplit={(e)=>splitBlock(e)}
              ancOptionS={ancOptionS}
              brancheS={brancheS}
              isSuper={isSuper}
              isDebug={isDebug} />
          );
        }
      })}
    </tbody>
  );
};

export default TideEditWrap;