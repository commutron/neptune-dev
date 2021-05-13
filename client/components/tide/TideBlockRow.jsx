import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const TideBlockRow = ({ 
  batch, describe, tideObj,
  lastStop, nextStart,
  editKey, editMode,
  splitKey, splitMode,
  setEdit, setEnd, setSplit,
  
  ancOptionS, plainBrancheS,
  isSuper, isDebug
})=> {
  
  const tideKey = tideObj.tKey;
  const tideWho = tideObj.who;
  const startTime = tideObj.startTime;
  const stopTime = tideObj.stopTime;
  const taskU = tideObj.task;
                
  const editOn = tideKey === editKey;
  const splitOn = tideKey === splitKey; 
  
  const [ tempStart, setTempStart ] = useState(false);
  const [ tempStop, setTempStop ] = useState(false);
  const [ tempSplit, setTempSplit ] = useState(false);
  const [ tempTask, setTempTask ] = useState(false);
  
  function safeCancel() {
    !splitOn ? editMode(false) : splitMode(false);
    setTempStart(false);
    setTempStop(false);
  }
  
  function saveTemp() {
    if(splitOn && tempSplit) {
      setSplit({batch, tideKey, tempSplit, startTime, stopTime});
    }else if(splitOn) {
      toast.info("no changes, not saved", {
        autoClose: 1000*10
      });
      editMode(false);
    }else{
      const newStart = tempStart || [startTime];
      const newStop = tempStop || [stopTime];
      const taskIs = tempTask || taskU;
      setEdit({batch, tideKey, newStart, newStop, taskIs});
    }
  }
 
  const mStart = moment(startTime);
  const isStop = stopTime === false ? false : true;
  const mStop = isStop ? moment(stopTime) : moment();
  
  const mStartDay = mStart.clone().startOf('day');
  const mStopDay = mStop.clone().endOf('day');
  
  const absoluteMin =
    !lastStop || !moment(lastStop).isAfter(mStartDay) ?
      mStartDay.format() : lastStop;
    
  const absoluteMax =
    !nextStart || moment(nextStart).isAfter(mStopDay) ?
      mStopDay.format() : nextStart;
  
  const editSelf = tideWho === Meteor.userId();
  const zeroed = isStop && !isDebug && mStop.diff(mStart, 'minutes') <= 0.5;
  const staticFormat = isDebug ? 'hh:mm:ss A' : 'hh:mm A';
  const staticAlt = isDebug ? "G:i:s K" : "G:i K";
  
  isDebug && console.log({ 
    mStart, mStop,
    lastStop, absoluteMin,
    nextStart, absoluteMax
  });
  
    return(
      <tr className={`smTxt ${editOn ? 'pop' : ''}`}>
        <td className='noRightBorder med'>
          <ExploreLinkBlock type='batch' keyword={batch} />
        </td>
        <td className='noRightBorder'>{describe}</td>
        
        <TideTaskExplicit
          taskIs={taskU}
          ancOptionS={ancOptionS}
          plainBrancheS={plainBrancheS}
          editOn={editOn}
          splitOn={splitOn}
          tempTask={tempTask}
          setTempTask={setTempTask} />
        
        <td className='noRightBorder numFont centreText timeInputs'>
          <i className="fas fa-play fa-fw fa-xs greenT"></i>
            {!editOn || splitOn ?
              <i> {mStart.format(staticFormat)}</i> 
              :
              <TimePicker
                stateValue={moment(mStart).format()}
                changeValue={(e)=>setTempStart(e)}
                defaultMmnt={mStart}
                minLimit={mStart.isSame(absoluteMin, 'minute') ?
                    moment(absoluteMin).format() :
                    moment(absoluteMin).startOf('minute').format()}
                maxLimit={tempStop[0] ? 
                    moment(tempStop[0]).format() :
                    mStop.clone().format()}
                calendarBool={true}
                staticAlt={staticAlt}
              />}
        </td>
        <td className='noRightBorder nospace centreText timeInputs'>
          {!editOn ?
            <em><i className="fas fa-long-arrow-alt-right"></i></em>
          : splitOn ?
              <TimePicker
                stateValue={mStop.clone().subtract(1, 'm').format()}
                changeValue={(e)=>setTempSplit(e)}
                defaultMmnt={mStop.clone().subtract(1, 'm')}
                minLimit={moment(startTime).endOf('minute').format()}
                maxLimit={mStop.clone().startOf('minute').format()}
                calendarBool={mStop.isAfter(mStart, 'day') === false}
                staticAlt={staticAlt}
              />
          :
            <button
              className='miniAction'
              onClick={()=>splitMode(true)}
              disabled={mStop.diff(mStart, 'minutes') < 2}
            ><i className="fas fa-cut"></i> cut</button>
          }
        </td>
        <td className='noRightBorder numFont centreText timeInputs'>
          <i className="fas fa-stop fa-fw fa-xs redT"></i>
          {!isStop ? <i> __:__ __</i> :
            !editOn || splitOn ?
            <i> {mStop.format(staticFormat)}</i>
            :
            <TimePicker
              stateValue={mStop.format()}
              changeValue={(e)=>setTempStop(e)}
              defaultMmnt={mStop}
              minLimit={tempStart[0] ? 
                          moment(tempStart[0]).endOf('minute').format() : 
                          moment(startTime).endOf('minute').format()}
              maxLimit={absoluteMax}
              calendarBool={mStop.isAfter(mStart, 'day') === false}
              staticAlt={staticAlt}
            />}
        </td>
        
        {editOn ?
          <Fragment>
            <td className='noRightBorder centreText'>
              <button
                className='miniAction'
                onClick={()=>saveTemp()}
              ><i className="fas fa-check"></i> save</button>
            </td>
            <td className='noRightBorder centreText'>
              <button
                className='miniAction'
                onClick={()=>safeCancel()}
              ><b><i className="fas fa-times"></i></b> cancel</button>
            </td>
          </Fragment>
        :
          <Fragment>
            <td className='noRightBorder clean numFont rightText'>
              {isStop ? Math.round( tideObj.durrAsMin ) : '...'}<i className='small'> min</i>
            </td>
            <td className='noRightBorder centreText'>
            {!isStop ?
              <button
                className='miniAction'
                onClick={()=>setEnd({batch, tideKey})}
                disabled={!isSuper}
              ><em><i className="far fa-edit"></i></em> stop</button>
            : 
              tideObj.lockOut ? <i className="fas fa-lock purpleT"></i> :
              <button
                className='miniAction'
                onClick={()=>editMode(true)}
                disabled={zeroed || ( !editSelf && !isSuper )}
              ><em><i className="far fa-edit"></i></em> edit</button>
            }
            </td>
          </Fragment>
        }
    </tr>
  );
};

export default TideBlockRow;


const TideTaskExplicit = ({ 
  taskIs, ancOptionS, plainBrancheS,
  editOn, splitOn, tempTask, setTempTask
})=> {
  
  const handleTask = (val)=> {
    setTempTask( val === 'false' ? false : val );
  };
  
  if( !editOn || splitOn ) {
    return(
      <td className='noRightBorder smTxt'>
        {taskIs ? taskIs : '   '}
      </td>
    );
  }

  return(
    <td className='noRightBorder centreText' title='Task'>
      <select
        id='tskSlctEdit'
        className='cap tableInput smTxt'
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskIs}
        disabled={false}>
        <option value={false}></option>
        <optgroup label='Ancillary'>
          {ancOptionS.map( (v, ix)=>(
            <option key={ix+'o1'} value={v}>{v}</option>
          ))}
        </optgroup>
        <optgroup label={Pref.branches}>
          {plainBrancheS.map( (v, ix)=>(
            <option key={ix+'o2'} value={v}>{v}</option>
          ))}
        </optgroup>
        <optgroup label='Other'>
          <option value='before release'>before release</option>
          <option value='after finish'>after finish</option>
          {/*<option value='out of route'>out of route</option>
          <option value='extend'>extend</option>*/}
        </optgroup>
      </select>
    </td>
  );
};


const TimePicker = ({ 
  stateValue, changeValue, defaultMmnt,
  minLimit, maxLimit, calendarBool, staticAlt
})=> (
  <Flatpickr
    value={stateValue}
    onChange={changeValue}
    options={{
      dateFormat: "Y-m-dTG:i:s",
      defaultDate: defaultMmnt.format("YYYY-m-dThh:mm:ss"),
      minDate: minLimit,
      maxDate: maxLimit,
      minuteIncrement: 1,
      noCalendar: calendarBool,
      enableTime: true,
      time_24hr: false,
      altInput: true,
      altFormat: staticAlt
    }}
  />
);