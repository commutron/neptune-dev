import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
//import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import TideWeekMini from '/client/components/charts/Tides/TideWeekMini.jsx';
import TideEditWrap from '/client/components/tide/TideEditWrap.jsx';

const ActivityPanel = ({ app, user, users, bCache })=> {
  
  const [weekChoice, setWeekChoice] = useState(false);
  const [weekData, setWeekData] = useState(false);
  
  function getData(fresh) {
    fresh && setWeekData(false);
    if(weekChoice) {
      const clientTZ = moment.tz.guess();
      const yearNum = weekChoice.yearNum;
      const weekNum = weekChoice.weekNum;
      const userID = user._id;
      Meteor.call('fetchWeekTideActivity', yearNum, weekNum, clientTZ, false, userID,
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
  
  useEffect( ()=>{
    getData(true);
  }, [weekChoice]);
    
  return(
    <div className='invert overscroll'>
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
        <TideEditWrap 
          weekData={weekData} 
          bCache={bCache} 
          updateData={()=>getData(false)} />
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