import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const TideBlockRow = ({ 
  batch, describe, tideKey, startTime, stopTime,
  lastStop, nextStart,
  editKey, editMode, 
  setEdit, setSplit
})=> {
  
  const editOn = tideKey === editKey; 
  
  const [ tempStart, setTempStart ] = useState(false);
  const [ tempStop, setTempStop ] = useState(false);
  const [ doSplit, chooseSplit ] = useState(false);
  const [ tempSplit, setTempSplit ] = useState(false);
  
  function saveTemp() {
    if(doSplit && tempSplit) {
      setSplit({batch, tideKey, tempSplit, stopTime});
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
    
  const absoluteMax = !nextStart && !moment().isAfter(moment(stopTime), 'day') ? moment().format() :
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
            {!editOn || doSplit ? ////////////////////////////////////// START
              <i> {mStart.format('hh:mm A')}</i> :
              <Flatpickr
                value={moment(mStart).format()}
                onClose={(e)=>setTempStart(e)} 
                options={{
                  dateFormat: "Y-m-dTG:i:s",
                  defaultDate: moment(mStart).format("YYYY-m-dThh:mm:ss"),
                  minDate: absoluteMin,
                  maxDate: tempStop[0] || stopTime,
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
          : doSplit ? ///////////////////////////////////////////////// SPLIT
            <Flatpickr
              value={moment(mStop).format()}
              onClose={(e)=>setTempSplit(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: moment(mStop).format("YYYY-m-dThh:mm:ss"),
                minDate: startTime,
                maxDate: stopTime,
                minuteIncrement: 5,
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
              onClick={()=>chooseSplit(true)}
            ><i className="fas fa-cut"></i></button>
          }
        </td>
        <td className='noRightBorder numFont centreText'>
          <i className="fas fa-stop fa-fw fa-xs redT"></i>
          {!editOn || doSplit ? mStop ? ///////////////////////////////// STOP
            <i> {mStop.format('hh:mm A')}</i> : 
            <i> __:__ __</i>
            : mStop ?
            <Flatpickr
              value={moment(mStop).format()}
              onClose={(e)=>setTempStop(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: moment(mStop).format("YYYY-m-dThh:mm:ss"),
                minDate: tempStart[0] || startTime,
                maxDate: absoluteMax,
                minuteIncrement: 1,
                noCalendar: mStop.isAfter(mStart, 'day') === false,
                enableTime: true,
                time_24hr: false,
                altInput: true,
                altFormat: "G:i K",
              }}
            />
            :  <i> __:__ __</i>}
        </td>
        
        {editOn ?
          <Fragment>
            <td className='noRightBorder centreText'>
              <button
                className='miniAction'
                onClick={()=>saveTemp()}
              >save</button>
            </td>
            <td className='noRightBorder centreText'>
              <button
                className='miniAction'
                onClick={!doSplit ? ()=>editMode(false) : ()=>chooseSplit(false)}
              >cancel</button>
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
                disabled={!mStop}
              >edit</button>
            </td>
          </Fragment>
        }
    </tr>
  );
};

export default TideBlockRow;