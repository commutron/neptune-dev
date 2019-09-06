import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
//import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import TideEditWrap from '/client/components/tide/TideEditWrap.jsx';


const ActivityPanel = ({ orb, bolt, app, user, users, bCache })=> {
  
  const clientTZ = moment.tz.guess();
  const [dateString, setDateString] = useState(moment().format('YYYY-MM-DD'));
  const [dayData, setDayData] = useState(false);
  
  function getData() {
    setDayData(false);
    Meteor.call('fetchOrgTideActivity', dateString, clientTZ, (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=> {
                          if (x1.startTime < x2.startTime) { return 1 }
                          if (x1.startTime > x2.startTime) { return -1 }
                          return 0;
                        });
      setDayData(cronoTimes);
	  });
  }
  
  useEffect(() => {
    getData();
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(dayData);
  }, [dateString]);
  
  function setDay(input) {
    const date = moment(input[0]).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    setDateString(date);
  }
  
  let minDate = moment(app.tideWall || app.createdAt).format('YYYY-MM-DD');

  return(
    <div className='invert overscroll'>
      <div className='line2x'>
        <Flatpickr
          value={moment().format('YYYY-MM-DD')}
          onChange={(e)=>setDay(e)} 
          options={{
            dateFormat: "Y-m-d",
            defaultDate: moment().format("YYYY-MM-DD"),
            minDate: minDate,
            maxDate: moment().format("YYYY-MM-DD"),
            altInput: true,
            altFormat: "F J",
          }} />
          <br />
          <span className='biggester breath numFont'> {moment.tz(dateString, clientTZ).year()}<sub>d</sub>{moment.tz(dateString, clientTZ).dayOfYear()} </span>
      </div>
      {!dayData ?
        <CalcSpin />
      :
      dayData.length === 0 ?
        <div>
          <p className='medBig centreText line4x'>No activity found for this day</p>
        </div>
      :
      <table className='wide cap space'>
        <tbody key={00}>
          <tr className='leftText line2x'>
            <th colSpan='3'></th>
            <th className='centreText'><i className="fas fa-play fa-fw fa-xs blackT"></i> Start<sup>i</sup></th>
            <th className='centreText'></th>
            <th className='centreText'><i className="fas fa-stop fa-fw fa-xs blackT"></i> Stop<sup>i</sup></th>
            <th>Duration<sup>ii</sup></th>
            <th></th>
          </tr>
        </tbody>
        <TideEditWrap
          weekData={dayData} 
          bCache={bCache} 
          updateData={()=>getData(false)}
          allUsers={true} />
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