import React, { Fragment, useState, useLayoutEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time-ship';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import TideWorkWeek from '/client/components/charts/Tides/TideWorkWeek.jsx';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const PerformanceSlide = ({ app, user, users, bCache, clientTZ, isDebug })=> {
  
  const [weekChoice, setWeekChoice] = useState(false);
  const [weekData, setWeekData] = useState(false);
  const [weekStart, setWeekStart] = useState(false);
  const [weekEnd, setWeekEnd] = useState(false);
  const [weekDays, setWeekDays] = useState(false);
  
  const [userList, setUserList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  
  const alldays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  function getData(fresh) {
    fresh && setWeekData(false);
    if(weekChoice) {
      const yearNum = weekChoice.yearNum;
      const weekNum = weekChoice.weekNum;
      Meteor.call('fetchWeekTideActivity', yearNum, weekNum, clientTZ, true, false, 
      (err, rtn)=>{
  	    err && console.log(err);
  	    const cronoTimes = rtn.sort((x1, x2)=> {
                            if (x1.startTime < x2.startTime) { return 1 }
                            if (x1.startTime > x2.startTime) { return -1 }
                            return 0;
                          });
        setWeekData(cronoTimes);
  	  });
    }
  }
  
  function getBack(response) {
    setWeekChoice(response);
  }
  
  useLayoutEffect( ()=>{
    getData(true);
    if(weekChoice) {
      const pinDate = moment().year(weekChoice.yearNum).week(weekChoice.weekNum);
      
      const start = pinDate.clone().startOf('week');
      const startCorrect = start.isWorkingDay() ? start : start.add(1, 'day');
      const end = pinDate.clone().endOf('week');
      const endCorrect = end.isWorkingDay() ? end : end.subtract(1, 'day');
      
      const from = startCorrect.day() === 0 ? 0 : 1;
      const to = endCorrect.day() === 6 ? 7 : 6;
      const weekdays = alldays.slice(from, to);
      
      setWeekStart(startCorrect);
      setWeekEnd(endCorrect);
      setWeekDays(weekdays);
    }
  }, [weekChoice]);
  
  useLayoutEffect( ()=>{
    const tideTime = weekData || [];
    
    const unqUsers = new Set( Array.from(tideTime, x => x.who ) );
    setUserList([...unqUsers]);
    
    const unqBatches = new Set( Array.from(tideTime, x => x.batch ) );
    setBatchList([...unqBatches].sort());
    
  }, [weekData]);
  
  
  const niceS = weekStart ? moment(weekStart).format('MMMM Do') : '';
  const niceP = weekEnd ? moment(weekEnd).format('MMMM Do') : '';

  return(
    <div className='space5x5 invert overscroll'>
      <div className='med vbreak comfort middle'>
        <WeekBrowse
          sendUp={(i)=>getBack(i)}
          app={app}
        />
        
        {weekStart &&
        <div className='centreRow'>
          <h2>{niceS}</h2>
          <em> <i className="fas fa-long-arrow-alt-right fa-2x fa-fw"></i> </em>
          <h2>{niceP}</h2>
        </div>}
          
      </div>
      
      {!weekData ?
        <CalcSpin />
      :
        <Fragment>
      
          <TideWorkWeek
            tideTimes={weekData}
            weekStart={weekStart}
            weekEnd={weekEnd}
            weekdays={weekDays}
            app={app}
            users={users}
            isDebug={isDebug} />
          
          <div className='balance dropCeiling'>
            <dl>
              <dt>User List ({userList.length})</dt>
              {userList.map( (ent, ix)=>{
                return(
                  <dd key={ent+ix}>
                    <UserNice id={ent} />
                  </dd>
              )})}
            </dl>
              
            <dl>
              <dt>{Pref.Batch} List ({batchList.length})</dt>
              {batchList.map( (ent, ix)=>{
                const moreInfo = bCache ? bCache.dataSet.find( x => x.batch === ent) : false;
                const what = moreInfo ? moreInfo.isWhat : 'unavailable';
                return(
                  <dd key={ent+ix}>
                    <ExploreLinkBlock type='batch' keyword={ent} /> <em>{what}</em>
                  </dd>
              )})}
            </dl>
          </div>
            
        </Fragment>
      }
          
    </div>
  );
};

export default PerformanceSlide;
        
        
        