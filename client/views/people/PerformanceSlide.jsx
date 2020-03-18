import React, { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
// import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import TideSpanTotal from '/client/components/tide/TideSpanTotal.jsx';
import TideWeekPolar from '/client/components/charts/Tides/TideWeekPolar.jsx';


const PerformanceSlide = ({ app, user, users, bCache, clientTZ })=> {
  
  const [weekChoice, setWeekChoice] = useState(false);
  const [weekData, setWeekData] = useState(false);
  
  function getData(fresh) {
    fresh && setWeekData(false);
    if(weekChoice) {
      const yearNum = weekChoice.yearNum;
      const weekNum = weekChoice.weekNum;
      Meteor.call('fetchWeekTideActivity', yearNum, weekNum, clientTZ, true, 
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
  }, [weekChoice]);

  return(
    <div className='space5x5 invert overscroll'>
      <div className='med vbreak comfort middle'>
        <WeekBrowse
          sendUp={(i)=>getBack(i)}
          app={app}
        />
        
        
        <TideSpanTotal 
          tideTimes={weekData || []}
          timeSpan='week'
          dateTime={moment(`${weekChoice.yearNum}-${weekChoice.weekNum}`, 'gggg-ww').format()}
          showUser={true}
          app={app} />
          
      </div>
      
      
      <TideWeekPolar
        tideTimes={weekData}
        dateTime={moment(`${weekChoice.yearNum}-${weekChoice.weekNum}`, 'gggg-ww').format()}
        yearNum={weekChoice.yearNum}
        weekNum={weekChoice.weekNum}
        app={app} />
          
          
    </div>
  );
};

export default PerformanceSlide;
        
        
        