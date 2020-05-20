import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
//import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import WeekBrowse from '/client/components/bigUi/WeekBrowse/WeekBrowse.jsx';
import TideWeekMini from '/client/components/charts/Tides/TideWeekMini.jsx';
import TideEditWrap from '/client/components/tide/TideEditWrap.jsx';

const ActivityPanel = ({ app, brancheS, user, isDebug, users, bCache })=> {
  
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
  
  const plainBrancheS = Array.from(brancheS, b => b.branch);
  const ancOptionS = app.ancillaryOption.sort();
    
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
          <p className='centreText'><i className="fas fa-ghost fa-4x grayT fade"></i></p>
          <p className='medBig centreText line3x'>No activity this week</p>
        </div>
      :
      <table className='wide cap space'>
        {/*<tbody key={00}>
          <tr className='leftText line2x'>
            <th colSpan='3'></th>
            <th className='centreText'><i className="fas fa-play fa-fw fa-xs blackT"></i> Start<sup>i</sup></th>
            <th className='centreText'></th>
            <th className='centreText'><i className="fas fa-stop fa-fw fa-xs blackT"></i> Stop<sup>i</sup></th>
            <th className='rightText'>Duration<sup>ii</sup></th>
            <th></th>
          </tr>
        </tbody>*/}
        <TideEditWrap 
          weekData={weekData} 
          bCache={bCache} 
          updateData={()=>getData(false)}
          user={user}
          isDebug={isDebug}
          app={app}
          ancOptionS={ancOptionS}
          plainBrancheS={plainBrancheS} />
      </table>
      }
      <div className='dropCeiling'>
        <p><sup>i.</sup>Times are displayed for timezone: {moment.tz.guess()}</p>
        <p><sup>ii.</sup>Durations are rounded to the nearest minute</p>
        <p><sup>o.</sup>Piece bar is 10 minute chunks for the whole day including breaks, lunch and overtime</p>
        <p><sup>oo.</sup>Progress bars are scaled to your expected Production Time percentage</p>
      </div>
    </div>
  );
};

export default ActivityPanel;