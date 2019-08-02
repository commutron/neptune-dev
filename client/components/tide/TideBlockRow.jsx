import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const TideBlockRow = ({ 
  batch, describe, tideKey, startTime, stopTime,
  lastStop, nextStart,
  editKey, editMode,
  splitKey, splitMode,
  setEdit, setSplit
})=> {
  
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
  const mStop = stopTime ? moment(stopTime) : false;
  
  const absoluteMin = !lastStop || !moment(lastStop).isAfter(moment(startTime).startOf('day')) ?
    moment(startTime).startOf('day').format() : lastStop;
    
  const absoluteMax = !mStop ? moment().format() : 
    !nextStart && !moment().isAfter(mStop, 'day') ? moment().format() :
      !nextStart || moment(nextStart).isAfter(moment(stopTime).endOf('day')) ?
        moment(stopTime).endOf('day').format() : nextStart;
  
  
    return(
      <tr className={editOn ? 'pop' : ''}>
        <td className='noRightBorder medBig'>
          <ExploreLinkBlock type='batch' keyword={batch} />
        </td>
        <td className='noRightBorder'>{describe}</td>
        <td className='noRightBorder numFont centreText'>
          <i className="fas fa-play fa-fw fa-xs greenT"></i>
            {!editOn || splitOn ? ////////////////////////////////////// START
              <i> {mStart.format('hh:mm A')}</i> :
              <Flatpickr
                value={moment(mStart).format()}
                onClose={(e)=>setTempStart(e)} 
                options={{
                  dateFormat: "Y-m-dTG:i:s",
                  defaultDate: moment(mStart).format("YYYY-m-dThh:mm:ss"),
                  minDate: absoluteMin,
                  maxDate: tempStop[0] ? 
                    moment(tempStop[0]).subtract(1, 'm').format() :
                    moment(stopTime).subtract(1, 'm').format(),
                  minuteIncrement: 1,
                  noCalendar: true,
                  enableTime: true,
                  time_24hr: false,
                  altInput: true,
                  altFormat: "G:i K",
                }}
              />}
        </td>
        <td className='noRightBorder centreText'>
          {!editOn ?
            <em><i className="fas fa-long-arrow-alt-right"></i></em>
          : splitOn ? ///////////////////////////////////////////////// SPLIT
            <Flatpickr
              value={mStop.clone().subtract(1, 'm').format()}
              onClose={(e)=>setTempSplit(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: mStop.clone().subtract(1, 'm').format("YYYY-m-dThh:mm:ss"),
                minDate: moment(startTime).add(1, 'm').format(),
                maxDate: mStop.clone().subtract(1, 'm').format(),
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
        <td className='noRightBorder numFont centreText'>
          <i className="fas fa-stop fa-fw fa-xs redT"></i>
          {!mStop ? <i> __:__ __</i> :
            !editOn || splitOn ? /////////////////////////////////////// STOP
            <i> {mStop.format('hh:mm A')}</i>
            :
            <Flatpickr
              value={mStop.format()}
              onClose={(e)=>setTempStop(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: mStop.format("YYYY-m-dThh:mm:ss"),
                minDate: tempStart[0] ? 
                          moment(tempStart[0]).add(1, 'm').format() : 
                          moment(startTime).add(1, 'm').format(),
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
              {mStop ? Math.round( moment.duration(mStop.diff(mStart)).asMinutes() ) : '_'} minutes
            </td>
            <td className='noRightBorder centreText'>
              <button
                className='miniAction'
                onClick={()=>editMode(true)}
                disabled={!mStop || mStop.diff(mStart, 'minutes') <= 0.5}
              ><em><i className="far fa-edit"></i></em> edit</button>
            </td>
          </Fragment>
        }
    </tr>
  );
};

export default TideBlockRow;