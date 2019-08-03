import React, { useState, useEffect } from 'react';
import moment from 'moment';
import timezone from 'moment-timezone';
//import Pref from '/client/global/pref.js';
//import { CalcSpin } from '/client/components/uUi/Spin.jsx';



const ActivityPanel = ({ app, user, users, bCache })=> {
  
  const [num, setNum] = useState(false);
  
  function getData(fresh) {
    /*
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
	  */
  }
  
  useEffect(() => {
    
  }, []);
  
  // console.log(yearNum);

  return(
    <div className='invert overscroll'>
      
      <div>
        <p><sup>i.</sup>Times are displayed for timezone: {moment.tz.guess()}</p>
        <p><sup>ii.</sup>Durations are rounded to the nearest minute</p>
      </div>
    </div>
  );
};

export default ActivityPanel;