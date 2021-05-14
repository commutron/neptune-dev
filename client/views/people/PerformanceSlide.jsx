import React, { Fragment, useState, useLayoutEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import TideWorkWeek from '/client/components/charts/Tides/TideWorkWeek.jsx';
import NumLine from '/client/components/tinyUi/NumLine.jsx';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';

const PerformanceSlide = ({ app, user, users, traceDT, isDebug })=> {
  
  const [weekChoice, setWeekChoice] = useState(false);
  const [weekData, setWeekData] = useState(false);
  const [weekStart, setWeekStart] = useState(false);
  const [weekEnd, setWeekEnd] = useState(false);
  const [weekDays, setWeekDays] = useState(false);
  
  const [userList, setUserList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  
  const [ selectDayState, selectDaySet ] = useState(false);
  const [ totalWeekHrsState, totalWeekHrsSet ] = useState(false);
  const [ totalLogHrsState, totalLogHrsSet ] = useState(false);
  const [ diffPotHrsState, diffPotHrsSet ] = useState(false);
  
  const alldays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  function getData(fresh) {
    fresh && setWeekData(false);
    if(weekChoice) {
      const yearNum = weekChoice.yearNum;
      const weekNum = weekChoice.weekNum;
      Meteor.call('fetchWeekTideActivity', yearNum, weekNum, true, false, 
      (err, rtn)=>{
  	    err && console.log(err);
        setWeekData(rtn);
  	  });
    }
  }
  
  function getBack(response) {
    setWeekChoice(response);
  }
  
  useLayoutEffect( ()=>{ // week selection
    getData(true);
    selectDaySet(false);
    if(weekChoice) {
      const pinDate = moment().year(weekChoice.yearNum).week(weekChoice.weekNum);
      
      const start = pinDate.clone().startOf('week');
      const startCorrect = start.isWorkingDay() ? start : start.clone().add(1, 'day');
      const end = pinDate.clone().endOf('week');
      const endCorrect = end.isWorkingDay() ? end : end.clone().subtract(1, 'day');
      
      const from = startCorrect.day() === 0 ? 0 : 1;
      const to = endCorrect.day() === 6 ? 7 : 6;
      const weekdays = alldays.slice(from, to);
      
      setWeekStart(startCorrect);
      setWeekEnd(endCorrect);
      setWeekDays(weekdays);
    }
  }, [weekChoice]);
  
  useLayoutEffect( ()=>{ // fetch data handling
    const tideTime = weekData || [];
    const ttDay = selectDayState && 
      alldays.findIndex( x => x === selectDayState);
    const dayFiltered = !ttDay ? tideTime :
      tideTime.filter( x => moment(x.startTime).day() === ttDay );
    
    const unqUsers = new Set( Array.from(dayFiltered, x => x.who ) );
    setUserList([...unqUsers]);
    
    const unqBatches = new Set( Array.from(dayFiltered, x => x.batch ) );
    setBatchList([...unqBatches].sort());
    
    const unqTasks = new Set( Array.from(dayFiltered, x => x.task ) );
    const unqTasksClean = [...unqTasks].filter( x => x !== null );
    setTaskList(unqTasksClean.sort());
    
  }, [weekData, selectDayState]);
  
  
  const niceS = weekStart ? weekStart.format('MMMM Do') : '';
  const niceP = weekEnd ? weekEnd.format('MMMM Do') : '';

  return(
    <div className='space5x5 overscroll2x'>
      <div className='med vbreak comfort middle'>
        <WeekBrowse
          sendUp={(i)=>getBack(i)}
          app={app}
        />
        
        {weekStart &&
        <div className='centreRow' onClick={()=>selectDaySet(false)}>
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
            isDebug={isDebug}
            selectDayUP={(v)=>selectDaySet(v)}
            totalWeekHrsUP={(v)=>totalWeekHrsSet(v)}
            totalLogHrsUP={(v)=>totalLogHrsSet(v)}
            diffPotHrsUP={(v)=>diffPotHrsSet(v)} />
          
          <div className='vgap centreRow'>
            <NumLine
              num={totalWeekHrsState}
              name='Hours Maximum for the Week'
              color='blueT'
              big={true} />
              
            <NumLine
              num={totalLogHrsState}
              name='Hours Logged'
              color='tealT'
              big={true} />
        
            <NumLine
              num={diffPotHrsState}
              name='Hours Under Maximum'
              color='grayT'
              big={true} />
          </div>
            
          <div className='autoGrid'>
            
            <span className='space1v centre'>
              <h4>{userList.length} Users [{selectDayState || 'Week ' + weekChoice.weekNum}]</h4>
              <dl>
                {userList.map( (ent, ix)=>(
                  <dd key={ent+ix}>
                    <UserNice id={ent} />
                  </dd>
                ))}
              </dl>
            </span>
              
            <span className='space1v centre'>
              <h4>{batchList.length} {Pref.XBatchs} [{selectDayState || 'Week ' + weekChoice.weekNum}]</h4>
              <dl>
                {batchList.map( (ent, ix)=>{
                  const moreInfo = traceDT ? traceDT.find( x => x.batch === ent) : false;
                  const what = moreInfo ? moreInfo.isWhat.join(' ') : 'unavailable';
                  return(
                    <dd key={ent+ix}>
                      <ExploreLinkBlock type='batch' keyword={ent} /> <em>{what}</em>
                    </dd>
                )})}
              </dl>
            </span>
            
            <span className='space1v center'>
              <h4> {taskList.length} Known Tasks [{selectDayState || 'Week ' + weekChoice.weekNum}]</h4>
              <dl>
                {taskList.map( (ent, ix)=>(
                  <dd key={ent+ix}>{ent}</dd>
                ))}
              </dl>
            </span>
            
          </div>
            
        </Fragment>
      }
          
    </div>
  );
};

export default PerformanceSlide;
        
        
        