import React, { Fragment, useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const TideBlockRow = ({ 
  describe, rad, tideObj,
  lastStop, nextStart,
  editKey, editMode,
  splitKey, splitMode,
  setEdit, setEnd, setSplit,
  
  ancOptionS, brancheS,
  isSuper, isDebug
})=> {
  
  const batch = tideObj.batch;
  const project = tideObj.project;
  const equip = project?.split(" ~ ")?.[0]?.substring(3);
  
  const dbHome = project ? false : batch;            
  const tideKey = tideObj.tKey;
  const tideWho = tideObj.who;
  const startTime = tideObj.startTime;
  const stopTime = tideObj.stopTime;
  const taskU = tideObj.task ? tideObj.task + ' | ' + (tideObj.subtask || '') : false;
  const overlap = tideObj.focus ? true : false;
  
  const editOn = tideKey === editKey;
  const splitOn = tideKey === splitKey; 
  
  const [ tempStart, setTempStart ] = useState(false);
  const [ tempStop, setTempStop ] = useState(false);
  const [ tempSplit, setTempSplit ] = useState(false);
  const [ tempTask, setTempTask ] = useState(false);
  const [ tempSubT, setTempSubT ] = useState(false);
  
  function safeCancel() {
    !splitOn ? editMode(false) : splitMode(false);
    setTempStart(false);
    setTempStop(false);
  }
  
  function saveTemp() {
    if(splitOn && tempSplit) {
      setSplit({dbHome, tideKey, tempSplit, startTime, stopTime});
    }else if(splitOn) {
      toast.info("no changes, not saved", {
        autoClose: 1000*10
      });
      editMode(false);
    }else{
      const newStart = tempStart || [startTime];
      const newStop = tempStop || [stopTime];
      const taskIs = tempTask || tideObj.task;
      const subtIs = tempTask ? tempSubT : tideObj.subtask;
      setEdit({dbHome, tideKey, newStart, newStop, taskIs, subtIs});
    }
  }
 
  const mStart = moment(startTime);
  const isStop = stopTime === false ? false : true;
  const mStop = isStop ? moment(stopTime) : moment();
  
  const mStartDay = mStart.clone().startOf('day');
  const mStopDay = mStop.clone().endOf('day');
  
  const absoluteMin =
    !lastStop || !moment(lastStop).isAfter(mStartDay) || overlap ?
      mStartDay.format() : lastStop;
    
  const absoluteMax =
    !nextStart || moment(nextStart).isAfter(mStopDay) || overlap ?
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
      <tr className={`smTxt ${editOn ? 'pop' : ''} ${overlap ? 'borderTeal' : ''}`}>
        <td className='noRightBorder med'>
        {project ?
          <ExploreLinkBlock type='equip' keyword={equip} /> :
          <ExploreLinkBlock type='batch' keyword={batch} rad={rad} />
        }
        </td>
        <td className='noRightBorder'>{describe}</td>
        
        <TideTaskExplicit
          taskIs={taskU}
          ancOptionS={ancOptionS}
          brancheS={brancheS}
          editOn={editOn}
          splitOn={splitOn}
          equipLock={tideObj.type === 'MAINT' ? true : false}
          tempTask={tempTask}
          setTempTask={setTempTask}
          tempSubT={tempSubT}
          setTempSubT={setTempSubT} />
        
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
              {overlap && 
                <i className='fa-solid fa-layer-group fa-fw gapR tealT' 
                   title={`Multi ${Pref.xBatch} time counts as 1/${tideObj.focus} duration`}>
                </i>}
              {isStop ? Math.round( tideObj.durrAsMin ) : '...'}<i className='small'> min</i>
            </td>
            <td className='noRightBorder centreText'>
            {!isStop ?
              <button
                className='miniAction'
                onClick={()=>setEnd({dbHome, tideKey})}
                disabled={!isSuper || overlap}
                title={overlap ? 'Not possible when using Multi-Mode' : ''}
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
  taskIs, ancOptionS, brancheS,
  editOn, splitOn, equipLock,
  tempTask, setTempTask, tempSubT, setTempSubT
})=> {
  
  const handleTask = (val)=> {
    if( !val || val === 'false' ) {
      setTempTask(false);
      setTempSubT(false);
    }else{
      const twoval = val.split("|");
      const tskval = twoval[0].trim();
      const sbtval = twoval[1].trim();
      setTempTask(tskval);
      setTempSubT( sbtval === '' ? false : sbtval);
    }
  };
  
  if( !editOn || splitOn || equipLock ) {
    return(
      <td className='noRightBorder smTxt'>
        {taskIs ? 
          taskIs.trim().replace(' | ', ' - ').replace(' |', '')
        : '   '}
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
        {!taskIs && <option value={false}></option>}
        <optgroup label='Ancillary'>
          {ancOptionS.map( (a, ix)=>(
            <option key={ix+'o1'} value={a + ' | '}>{a}</option>
          ))}
        </optgroup>
        <optgroup label={Pref.branches}>
          {brancheS.map( (v, ix)=>(
            <Fragment key={ix+'o2'}>
            <option value={v.branch + ' | '}>{v.branch}</option>
            {v.subTasks && v.subTasks.map( (stsk, ixs)=>(
              <option key={ixs+'o3'} value={v.branch + ' | ' + stsk}>&emsp;{stsk}</option>
            ))}
            </Fragment>
          ))}
        </optgroup>
        <optgroup label='Other'>
          <option value='before release | '>before release</option>
          <option value='after finish | '>after finish</option>
          <option value='out of route | '>out of route</option>
          {/*<option value='extend | '>extend</option>*/}
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