import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const TideBlockRow = ({ 
  batch, describe, tideObj,
  // startTime, stopTime,
  lastStop, nextStart,
  editKey, editMode,
  splitKey, splitMode,
  setEdit, setEnd, setSplit,
  
  ancOptionS, plainBrancheS,
  isDebug
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
  const isStop = stopTime ? true : false;
  const mStop = stopTime ? moment(stopTime) : moment();// this is what is causing the warning
  
  const absoluteMin =
  !lastStop || !moment(lastStop).isAfter(moment(startTime).startOf('day')) ?
    moment(startTime).startOf('day').format() : lastStop;
    
  const absoluteMax =
  !isStop ? mStop.format() : 
    !nextStart && !moment().isAfter(mStop, 'day') ? mStop.format() :
      !nextStart || moment(nextStart).isAfter(mStop.endOf('day')) ?
        mStop.endOf('day').format() : nextStart;
  
  const editSelf = tideWho === Meteor.userId();
  const editAuth = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const zeroed = isStop && mStop.diff(mStart, 'minutes') <= 0.5 ? true : false;
  const staticFormat = isDebug ? 'hh:mm:ss A' : 'hh:mm A';
  
    return(
      <Fragment>
      <tr className={editOn ? 'pop' : ''}>
        <td className='noRightBorder medBig'>
          <ExploreLinkBlock type='batch' keyword={batch} />
        </td>
        <td className='noRightBorder smTxt'>{describe}</td>
        
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
            {!editOn || splitOn ? ////////////////////////////////////// START
              <i> {mStart.format(staticFormat)}</i> 
              :
              <Flatpickr
                value={moment(mStart).format()}
                onChange={(e)=>setTempStart(e)} 
                options={{
                  dateFormat: "Y-m-dTG:i:s",
                  defaultDate: moment(mStart).format("YYYY-m-dThh:mm:ss"),
                  minDate: moment(absoluteMin).startOf('minute').format(),
                  maxDate: tempStop[0] ? 
                    moment(tempStop[0]).startOf('minute').format() :
                    mStop.startOf('minute').format(),
                  minuteIncrement: 1,
                  noCalendar: true,
                  enableTime: true,
                  time_24hr: false,
                  altInput: true,
                  altFormat: "G:i K",
                }}
              />}
        </td>
        <td className='noRightBorder nospace centreText timeInputs'>
          {!editOn ?
            <em><i className="fas fa-long-arrow-alt-right"></i></em>
          : splitOn ? ///////////////////////////////////////////////// SPLIT
            <Flatpickr
              value={mStop.clone().subtract(1, 'm').format()}
              onChange={(e)=>setTempSplit(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: mStop.clone().subtract(1, 'm').format("YYYY-m-dThh:mm:ss"),
                minDate: moment(startTime).endOf('minute').format(),
                maxDate: mStop.clone().startOf('minute').format(),
                minuteIncrement: 1,
                noCalendar: mStop.isAfter(mStart, 'day') === false,
                enableTime: true,
                time_24hr: false,
                altInput: true,
                altFormat: "G:i K",
              }}
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
            !editOn || splitOn ? /////////////////////////////////////// STOP
            <i> {mStop.format(staticFormat)}</i>
            :
            <Flatpickr
              value={mStop.format()}
              onChange={(e)=>setTempStop(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: mStop.format("YYYY-m-dThh:mm:ss"),
                minDate: tempStart[0] ? 
                          moment(tempStart[0]).endOf('minute').format() : 
                          moment(startTime).endOf('minute').format(),
                maxDate: absoluteMax,
                minuteIncrement: 1,
                noCalendar: mStop.isAfter(mStart, 'day') === false,
                enableTime: true,
                time_24hr: false,
                altInput: true,
                altFormat: "G:i K",
              }}
            />
            }
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
              {isStop ? Math.round( tideObj.durrAsMin ) : '...'}<i className='small'> minutes</i>
            </td>
            <td className='noRightBorder centreText'>
            {!isStop ?
              <button
                className='miniAction'
                onClick={()=>setEnd({batch, tideKey})}
                disabled={!editAuth}
              ><em><i className="far fa-edit"></i></em> stop</button>
            :
              <button
                className='miniAction'
                onClick={()=>editMode(true)}
                disabled={zeroed || ( !editSelf && !editAuth )}
              ><em><i className="far fa-edit"></i></em> edit</button>
            }
            </td>
          </Fragment>
        }
    </tr>
    
    </Fragment>
  );
};

export default TideBlockRow;


const TideTaskExplicit = ({ 
  taskIs, ancOptionS, plainBrancheS,
  editOn, splitOn, tempTask, setTempTask
})=> {
  
  if( !editOn || splitOn ) {
    return(
      <td className='noRightBorder smTxt'>
        {taskIs ? taskIs : '   '}
      </td>
    );
  }

  return(
    <td className='noRightBorder centreText'>
      <em><i className="fas fa-exchange-alt fa-fw tealT"></i> </em>
      <select
        id='tskSlctEdit'
        className='cap tableInput smTxt'
        onChange={(e)=>setTempTask(e.target.value)}
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
      </select>
    </td>
  );
};