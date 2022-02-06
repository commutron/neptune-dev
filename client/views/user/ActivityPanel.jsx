import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { CalcSpin } from '/client/components/tinyUi/Spin';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse';
import TideWeekMini from '/client/components/charts/Tides/TideWeekMini';
import TideEditWrap from '/client/components/tide/TideEditWrap';

const ActivityPanel = ({ app, brancheS, user, isDebug, users, traceDT })=> {
  
  const [weekChoice, setWeekChoice] = useState(false);
  const [weekData, setWeekData] = useState(false);
  
  function getData(fresh) {
    fresh && setWeekData(false);
    if(weekChoice) {
      const yearNum = weekChoice.yearNum;
      const weekNum = weekChoice.weekNum;
      const userID = user._id;
      Meteor.call('fetchWeekTideActivity', yearNum, weekNum, false, userID,
      (err, rtn)=>{
  	    err && console.log(err);
  	    const cronoTimes = rtn.sort((x1, x2)=>
                              x1.startTime < x2.startTime ? 1 : 
                              x1.startTime > x2.startTime ? -1 : 0 );
        setWeekData(cronoTimes);
  	  });
    }
  }
  
  function getBack(response) {
    setWeekChoice(response);
  }
  
  useEffect( ()=>{
    getData(true);
  }, [weekChoice]);
  
  const ancOptionS = app.ancillaryOption.sort();
    
  return(
    <div className='overscroll'>
      <div className='med vbreak comfort middle'>
        <WeekBrowse
          sendUp={(i)=>getBack(i)}
          app={app}
        />
        
        <TideWeekMini
          tideTimes={weekData || []}
          dateTime={moment(`${weekChoice.yearNum}-${weekChoice.weekNum}`, 'gggg-ww').format()}
          user={user}
          app={app} />
          
      </div>
      {!weekData ?
        <CalcSpin />
      :
      weekData.length === 0 ?
        <div className='darkgrayT'>
          <p className='centreText'><i className="fas fa-ghost fa-3x"></i></p>
          <p className='medBig centreText line2x'>No activity this week</p>
        </div>
      :
      <table className='wide cap space'>
        <TideEditWrap 
          weekData={weekData} 
          traceDT={traceDT} 
          updateData={()=>getData(false)}
          user={user}
          isDebug={isDebug}
          app={app}
          ancOptionS={ancOptionS}
          brancheS={brancheS} />
      </table>
      }
      <div className='dropCeiling smTxt'>
        <p><sup>i.</sup>Times are displayed for timezone: {moment.tz.guess()}</p>
        <p><sup>ii.</sup>Durations are rounded to the nearest minute</p>
        <p><sup>o.</sup>Piece bar is 10 minute chunks for the whole day including breaks, lunch and overtime</p>
        <p><sup>oo.</sup>Progress bars are scaled to your expected Production Time percentage</p>
      </div>
    </div>
  );
};

export default ActivityPanel;