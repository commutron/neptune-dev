import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import TideBlockRow from '/client/components/tide/TideBlockRow.jsx';


const TideEditWrap = ({ weekData, bCache, updateData, allUsers })=> {
  
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

    if(!batch || !tideKey || !newStart || !newStop) { 
      console.log([{batch, tideKey, newStart, newStop}, 'data issue no call']);
    }else{
      Meteor.call('editTideTimeBlock', batch, tideKey, newStart, newStop, (err, asw)=>{
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
        const lastStop = weekData[index+1] ? weekData[index+1].stopTime : false;
        const nextStart = lastStart ? lastStart : false;
        
        if(index === 0 || moment(blk.startTime).isSame(lastStart, 'day') === false) {
          return(
            <Fragment key={index}>
              <tr key={blk.startTime.toISOString()} className='big leftText line4x'>
                <th colSpan={!allUsers ? '5' : '6'}>{moment(blk.startTime).format('dddd MMMM Do')}</th>
              </tr>
              <TideBlockRow
                key={blk.tKey}
                batch={keyword}
                describe={what}
                tideKey={blk.tKey}
                tideWho={blk.who}
                allUsers={allUsers}
                startTime={blk.startTime}
                stopTime={blk.stopTime}
                lastStop={lastStop}
                nextStart={nextStart}
                editKey={doEditKey}
                editMode={(e)=>enableEdit(e ? blk.tKey : false)}
                splitKey={doSplitKey}
                splitMode={(e)=>enableSplit(e ? blk.tKey : false)}
                setEdit={(e)=>editBlock(e)}
                setSplit={(e)=>splitBlock(e)} />
            </Fragment>
          );
        }else{
          return(
            <TideBlockRow
              key={blk.tKey}
              batch={keyword}
              describe={what}
              tideKey={blk.tKey}
              tideWho={blk.who}
              allUsers={allUsers}
              startTime={blk.startTime}
              stopTime={blk.stopTime}
              lastStop={lastStop}
              nextStart={nextStart}
              editKey={doEditKey} 
              editMode={(e)=>enableEdit(e ? blk.tKey : false)}
              splitKey={doSplitKey}
              splitMode={(e)=>enableSplit(e ? blk.tKey : false)}
              setEdit={(e)=>editBlock(e)}
              setSplit={(e)=>splitBlock(e)} />
          );
        }
      })}
    </tbody>
  );
};

export default TideEditWrap;