import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const ActivityPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
  const [yearNum, setYearNum] = useState(moment().weekYear());
  const [weekNum, setWeekNum] = useState(moment().week());
  const [backwardLock, setBacklock] = useState(false);
  const [forwardLock, setForlock] = useState(true);
  
  const [weekData, setWeekData] = useState(false);
  
  // function jumpTo(location) {
  //   Session.set('now', location);
  //   FlowRouter.go('/production');
  // }
  
  function getData() {
    setWeekData(false);
    Meteor.call('fetchSelfTideActivity', yearNum, weekNum, (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=> {
                          if (x1.startTime < x2.startTime) { return 1 }
                          if (x1.startTime > x2.startTime) { return -1 }
                          return 0;
                        });
      setWeekData(cronoTimes);
	  });
  }
  
  useEffect(() => {
    getData();
    yearNum === moment().weekYear() && weekNum === moment().week() ?
      setForlock(true) : setForlock(false);
    yearNum === moment(app.tideWall || app.createdAt).weekYear() && 
    weekNum === moment(app.tideWall || app.createdAt).week() ?
      setBacklock(true) : setBacklock(false);
    
    Roles.userIsInRole(Meteor.userId(), ['admin', 'debug']) && console.log(weekData);
  }, [yearNum, weekNum]);
  
  function tickWeek(direction) {
    const yearNow = yearNum;
    const weekNow = weekNum;
    
    if( direction === 'down' ) {
      if( weekNow > 1 ) {
        setWeekNum( weekNow - 1 );
      }else{
        setYearNum( yearNow - 1 );
        setWeekNum( moment(yearNow - 1, 'YYYY').weeksInYear() );
      }
    }else if( direction === 'up') {
      if( weekNow < moment(yearNow, 'YYYY').weeksInYear() ) {
        setWeekNum( weekNow + 1 );
      }else{
        setYearNum( yearNow + 1 );
        setWeekNum( 1 );
      }
    }else if( direction === 'now') {
      setYearNum(moment().weekYear());
      setWeekNum(moment().week());
    }else{
      setYearNum(moment(app.tideWall || app.createdAt).weekYear());
      setWeekNum(moment(app.tideWall || app.createdAt).week());
    }
  }
  
  // console.log(yearNum);
  // console.log(weekNum);

  return(
    <div className='invert overscroll'>
      <div className='med line3x'>
        <WeekBrowse
          weekNum={weekNum}
          yearNum={yearNum}
          tickWeek={(i)=>tickWeek(i)}
          backwardLock={backwardLock}
          forwardLock={forwardLock}
        />
      </div>
      {!weekData ?
        <CalcSpin />
      :
      weekData.length === 0 ?
        <div>
          <p className='medBig centreText line4x'>No activity found for this week</p>
        </div>
      :
      <table className='wide cap space'>
        <tbody key={00}>
          <tr className='leftText line2x'>
            <th colSpan='2'></th>
            <th><i className="fas fa-play fa-fw fa-xs blackT"></i> Start</th>
            <th><i className="fas fa-stop fa-fw fa-xs blackT"></i> Stop</th>
            <th>Duration<sup>i</sup></th>
            {/*<th colSpan='2'></th>*/}
          </tr>
        </tbody>
          {weekData.map( (blk, index)=>{
            const keyword = blk.batch;
            //const elink = '/data/batch?request=' + keyword;
            const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === blk.batch) : false;
            const what = moreInfo ? moreInfo.isWhat : 'unavailable';
            const mStart = moment(blk.startTime);
            const mStop = blk.stopTime ? moment(blk.stopTime) : false;
            if(index === 0 || moment(blk.startTime).isSame(weekData[index-1].startTime, 'day') === false) {
              return(
                <tbody key={blk.tKey}>
                  <tr className='big leftText line4x'>
                    <th colSpan='5'>{moment(blk.startTime).format('dddd MMMM Do')}</th>
                  </tr>
                  <TideBlockRow
                    batch={keyword}
                    describe={what}
                    tideKey={blk.tKey}
                    mStart={mStart}
                    mStop={mStop} />
                </tbody>
              );
            }
            return(
              <tbody key={blk.tKey}>
                <TideBlockRow
                  batch={keyword}
                  describe={what}
                  tideKey={blk.tKey}
                  mStart={mStart}
                  mStop={mStop} />
              </tbody>
            );
          })
        }
      </table>
      }
      <p className='rightText'>
        <sup>i.</sup>Durations are rounded to the nearest minute
      </p>
    </div>
  );
};

export default ActivityPanel;



const TideBlockRow = ({ batch, describe, tideKey, mStart, mStop })=> {
  
  const [edit, enableEdit] = useState(false);
  
    return(
      <tr>
        <td className='noRightBorder medBig'>
          <ExploreLinkBlock type='batch' keyword={batch} />
        </td>
        <td className='noRightBorder'>{describe}</td>
        <td className='noRightBorder numFont'>
          <i className="fas fa-play fa-fw fa-xs greenT"></i>
            {!edit ? 
              <i> {mStart.format('hh:mm A')}</i> :
              <Flatpickr
                value={moment(mStart).format()}
                onClose={(e)=>console.log(e)} 
                options={{
                  dateFormat: "Y-m-dTG:i:s",
                  defaultDate: moment(mStart).format("YYYY-m-dThh:mm:ss"),
                  minuteIncrement: 1,
                  //noCalendar: true,
                  enableTime: true,
                  time_24hr: false,
                  altInput: true,
                  altFormat: "G:i K",
                }}
              />}
        </td>
        <td className='noRightBorder numFont'>
          <i className="fas fa-stop fa-fw fa-xs redT"></i>
          {!edit ? mStop ? 
            <i> {mStop.format('hh:mm A')}</i> : 
            <i> __:__ __</i>
            : mStop ?
            <Flatpickr
              value={moment(mStop).format()}
              onClose={(e)=>console.log(e)} 
              options={{
                dateFormat: "Y-m-dTG:i:s",
                defaultDate: moment(mStop).format("YYYY-m-dThh:mm:ss"),
                minuteIncrement: 1,
                //noCalendar: true,
                enableTime: true,
                time_24hr: false,
                altInput: true,
                altFormat: "G:i K",
              }}
            />
            :  <i> __:__ __</i>}
        </td>
        
        <td className='noRightBorder clean numFont'>
          {mStop ? Math.round( moment.duration(mStop.diff(mStart)).asMinutes() ) : '_'} minutes
        </td>
        <td className='noRightBorder clean numFont'>
          <button onClick={()=>enableEdit(!edit)}>{edit ? 'save' : 'edit'}</button>
        </td>
    </tr>
  );
};