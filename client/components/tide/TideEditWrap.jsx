import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
// import Pref from '/client/global/pref.js';
import DayPieceBar from '/client/components/charts/Tides/DayPieceBar.jsx';
import TideBlockRow from '/client/components/tide/TideBlockRow.jsx';


const TideEditWrap = ({ 
  weekData, bCache, updateData, 
  user, isDebug, 
  app, ancOptionS, plainBrancheS 
})=> {
  
  const [ doEditKey, enableEdit ] = useState(false);
  const [ doSplitKey, enableSplit ] = useState(false);
  
  useEffect(()=> {
    enableSplit(false);
  }, [doEditKey]);
  
  function editBlock(e) {
    enableEdit(false);
    const batch = e.batch;
    const tideKey = e.tideKey;
    const newStart = Array.isArray(e.newStart) ? e.newStart[0] : false;
    const newStop = Array.isArray(e.newStop) ? e.newStop[0] : false;
    const taskIs = e.taskIs;
    
    if(!batch || !tideKey || !newStart || !newStop) { 
      console.log([{batch, tideKey, newStart, newStop}, 'data issue no call']);
    }else{
      Meteor.call('editTideTimeBlock', 
        batch, tideKey, newStart, newStop, taskIs, 
        (err, asw)=>{
          err && console.log(err);
          if(asw === true) {
            updateData();
          }
      });
    }
  }
  function endBlock(e) {
    const batch = e.batch;
    const tideKey = e.tideKey;

    if(!batch || !tideKey) { 
      console.log([{batch, tideKey}, 'data issue no call']);
    }else{
      Meteor.call('stopTideTimeBlock', batch, tideKey, (err, asw)=>{
        err && console.log(err);
        if(asw === true) {
          updateData();
        }
      });
    }
  }
  function splitBlock(e) {
    enableEdit(false);
    const batch = e.batch;
    const tideKey = e.tideKey;
    const newSplit = Array.isArray(e.tempSplit) ? e.tempSplit[0] : false;
    const stopTime = e.stopTime;

    if(!batch || !tideKey || !newSplit || !stopTime) { 
      console.log([{batch, tideKey, newSplit, stopTime}, 'data issue no call']);
    }else{
      Meteor.call('splitTideTimeBlock', batch, tideKey, newSplit, stopTime, (err, asw)=>{
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
        const keyword = blk.batch;
        const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === blk.batch) : false;
        const what = moreInfo ? moreInfo.isWhat : 'unavailable';
        
        const lastStart = weekData[index-1] && weekData[index-1].startTime;
        const lastStop = weekData[index+1] && weekData[index+1].stopTime;
        // const lastStart = weekData[index-1]?.startTime; // STILL
        // const lastStop = weekData[index+1]?.stopTime; // WONT LINT
        const nextStart = lastStart ? lastStart : false;
        
        if(index === 0 || moment(blk.startTime).isSame(lastStart, 'day') === false) {
          const newDayTime = moment(blk.startTime);
          const dayStart = newDayTime.clone().startOf('day').nextWorkingTime();
          const dayEnd = newDayTime.clone().endOf('day').lastWorkingTime();
          const restOfDay = weekData.filter( x => newDayTime.isSame(x.startTime, 'day') );
          return(
            <Fragment key={index+blk.tKey}>
              <tr key={blk.startTime.toISOString()} className='big leftText line4x'>
                <th colSpan='5'>{newDayTime.format('dddd MMMM Do')}</th>
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
                batch={keyword}
                describe={what}
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
                plainBrancheS={plainBrancheS}
                isDebug={isDebug} />
            </Fragment>
          );
        }else{
          return(
            <TideBlockRow
              key={blk.tKey}
              batch={keyword}
              describe={what}
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
              plainBrancheS={plainBrancheS}
              isDebug={isDebug} />
          );
        }
      })}
    </tbody>
  );
};

export default TideEditWrap;