import React, { useState, useEffect } from 'react';
import moment from 'moment';
import timezone from 'moment-timezone';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import TideEditWrap from '/client/components/tide/TideEditWrap.jsx';


const ActivityPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
  const [yearNum, setYearNum] = useState(moment().weekYear());
  const [weekNum, setWeekNum] = useState(moment().week());
  const [backwardLock, setBacklock] = useState(false);
  const [forwardLock, setForlock] = useState(true);
  
  const [weekData, setWeekData] = useState(false);
  
  function getData(fresh) {
    fresh && setWeekData(false);
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
    getData(true);
    yearNum === moment().weekYear() && weekNum === moment().week() ?
      setForlock(true) : setForlock(false);
    yearNum === moment(app.tideWall || app.createdAt).weekYear() && 
    weekNum === moment(app.tideWall || app.createdAt).week() ?
      setBacklock(true) : setBacklock(false);
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(weekData);
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
            <th className='centreText'><i className="fas fa-play fa-fw fa-xs blackT"></i> Start<sup>i</sup></th>
            <th className='centreText'></th>
            <th className='centreText'><i className="fas fa-stop fa-fw fa-xs blackT"></i> Stop<sup>i</sup></th>
            <th>Duration<sup>ii</sup></th>
            <th></th>
          </tr>
        </tbody>
        <TideEditWrap weekData={weekData} bCache={bCache} updateData={()=>getData(false)} />
      </table>
      }
      <div>
        <p><sup>i.</sup>Times are displayed for timezone: {moment.tz.guess()}</p>
        <p><sup>ii.</sup>Durations are rounded to the nearest minute</p>
      </div>
    </div>
  );
};

export default ActivityPanel;