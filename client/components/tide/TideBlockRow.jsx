import React, { Fragment, useState } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
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
  setEdit, setEnd, setSplit
})=> {
  
  const tideKey = tideObj.tKey;
  const tideWho = tideObj.who;
  const startTime = tideObj.startTime;
  const stopTime = tideObj.stopTime;
                
  const editOn = tideKey === editKey;
  const splitOn = tideKey === splitKey; 
  
  const [ tempStart, setTempStart ] = useState(false);
  const [ tempStop, setTempStop ] = useState(false);
  const [ tempSplit, setTempSplit ] = useState(false);
  
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
      setEdit({batch, tideKey, newStart, newStop});
    }
  }
 
  const mStart = moment(startTime);
  const mStop = stopTime ? moment(stopTime) : false;// this is what is causing the warning
  
  const absoluteMin =
  !lastStop || !moment(lastStop).isAfter(moment(startTime).startOf('day')) ?
    moment(startTime).startOf('day').format() : lastStop;
    
  const absoluteMax =
  !mStop ? moment().format() : 
    !nextStart && !moment().isAfter(mStop, 'day') ? moment().format() :
      !nextStart || moment(nextStart).isAfter(moment(mStop).endOf('day')) ?
        moment(mStop).endOf('day').format() : nextStart;
  
  const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
  
  const editSelf = tideWho === Meteor.userId();
  const editAuth = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const zeroed = mStop && mStop.diff(mStart, 'minutes') <= 0.5 ? true : false;
  const staticFormat = isDebug ? 'hh:mm:ss A' : 'hh:mm A';
  
    return(
      <tr className={editOn ? 'pop' : ''}>
        <td className='noRightBorder medBig'>
          <ExploreLinkBlock type='batch' keyword={batch} />
        </td>
        <td className='noRightBorder'>{describe}</td>
        <td className='noRightBorder numFont centreText timeInputs'>
          <i className="fas fa-play fa-fw fa-xs greenT"></i>
            {!editOn || splitOn ? ////////////////////////////////////// START
              <i> {mStart.format(staticFormat)}</i> :
              <Flatpickr
                value={moment(mStart).format()}
                onClose={(e)=>setTempStart(e)} 
                options={{
                  dateFormat: "Y-m-dTG:i:s",
                  defaultDate: moment(mStart).format("YYYY-m-dThh:mm:ss"),
                  minDate: moment(absoluteMin).startOf('minute').format(),
                  maxDate: tempStop[0] ? 
                    moment(tempStop[0]).startOf('minute').format() :
                    moment(mStop).startOf('minute').format(),
                  minuteIncrement: 1,
                  noCalendar: true,
                  enableTime: true,
                  time_24hr: false,
                  altInput: true,
                  altFormat: "G:i K",
                }}
              />}
        </td>
        <td className='noRightBorder centreText timeInputs'>
          {!editOn ?
            <em><i className="fas fa-long-arrow-alt-right"></i></em>
          : splitOn ? ///////////////////////////////////////////////// SPLIT
            <Flatpickr
              value={mStop.clone().subtract(1, 'm').format()}
              onClose={(e)=>setTempSplit(e)} 
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
          {!mStop ? <i> __:__ __</i> :
            !editOn || splitOn ? /////////////////////////////////////// STOP
            <i> {mStop.format(staticFormat)}</i>
            :
            <Flatpickr
              value={mStop.format()}
              onClose={(e)=>setTempStop(e)} 
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
            <td className='noRightBorder clean numFont'>
              {mStop ? Math.round( moment.duration(mStop.diff(mStart)).asMinutes() ) : '...'} minutes
            </td>
            <td className='noRightBorder centreText'>
            {!mStop ?
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
  );
};

export default TideBlockRow;