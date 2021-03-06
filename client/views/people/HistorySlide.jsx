import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { HolidayCheck } from '/client/utility/WorkTimeCalc.js';
// import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import TideDayMini from '/client/components/charts/Tides/TideDayMini.jsx';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';
import { AnonyUser } from '/client/components/smallUi/UserNice.jsx';

const HistorySlide = ({ app, user, users, traceDT, isDebug })=> {
  
  const [dateString, setDateString] = useState(moment().format('YYYY-MM-DD'));
  const [dayData, setDayData] = useState(false);
  
  function getData() {
    setDayData(false);
    Meteor.call('fetchOrgTideActivity', dateString, (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=>
              x1.startTime < x2.startTime ? 1 : x1.startTime > x2.startTime ? -1 : 0 );
      setDayData(cronoTimes);
	  });
  }
  
  useEffect(() => {
    getData();
    isDebug && console.log(dayData);
  }, [dateString]);
  
  function setDay(input) {
    const date = moment(input[0]).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    setDateString(date);
  }
  
  let minDate = moment(app.tideWall || app.createdAt).format('YYYY-MM-DD');
  
  const localDate = moment.tz(dateString, moment.tz.guess());
  const isHoliday = HolidayCheck( app.nonWorkDays, moment(dateString, 'YYYY-MM-DD').format());
                      
  return(
    <div className='space5x5 overscroll'>
      <div className='med vbreak comfort middle'>
        <div className='line2x'>
          <Flatpickr
            value={moment().format('YYYY-MM-DD')}
            onChange={(e)=>setDay(e)}
            required
            options={{
              dateFormat: "Y-m-d",
              defaultDate: moment().format("YYYY-MM-DD"),
              minDate: minDate,
              maxDate: moment().format("YYYY-MM-DD"),
              altInput: true,
              altFormat: "F J",
            }} />
            <br />
            <span className='biggester breath numFont'
              > {localDate.year()}<sub>d</sub>{localDate.dayOfYear()} </span>
            <br />
            {isHoliday ? <span className='bigger line05x'>Holiday</span> : null}
        </div>
      
        <TideDayMini
          tideTimes={dayData || []}
          timeSpan='day'
          dateTime={moment(dateString, 'YYYY-MM-DD').format()}
          showUser={true}
          app={app}
          users={users} />
      
      </div>
      {!dayData ?
        <CalcSpin />
      :
      dayData.length === 0 ?
        <div>
          <p className='centreText'><i className="fas fa-ghost fa-4x grayT fade"></i></p>
          <p className='medBig centreText line3x'>No activity on this day</p>
        </div>
      :
      <table className='wide cap space'>
        {/*<tbody key={00}>
          <tr className='leftText line2x'>
            <th colSpan='3' className='bigger'
              >{moment(dateString, 'YYYY-MM-DD').format('dddd MMMM Do')}
            </th>
            
            <th className='centreText'><i className="fas fa-play fa-fw fa-xs blackT"></i> Start<sup>i</sup></th>
            <th className='centreText'></th>
            <th className='centreText'><i className="fas fa-stop fa-fw fa-xs blackT"></i> Stop<sup>i</sup></th>
            
            <th>Task<sup>ii</sup></th>
            <th className='rightText'>Duration<sup>iii</sup></th>
          </tr>
        </tbody>*/}
        <tbody>
        {dayData.map( (blk, index)=>{
          const keyword = blk.batch;
          const moreInfo = traceDT ? traceDT.find( x => x.batch === blk.batch) : false;
          const what = moreInfo ? moreInfo.isWhat.join(' ') : 'unavailable';
          
          const lastStart = dayData[index-1] && dayData[index-1].startTime;
          
          if(index === 0 || moment(blk.startTime).isSame(lastStart, 'hour') === false) {
            return(
              <Fragment key={blk.tKey+index}>
                <tr key={blk.startTime.toISOString()} className='medBig leftText line4x'>
                  <th colSpan='4'>{moment(blk.startTime).format('h A')}</th>
                </tr>
                <TidePlainRow
                  key={blk.tKey}
                  batch={keyword}
                  describe={what}
                  tBlock={blk} />
              </Fragment>
            );
          }else{
            return(
              <TidePlainRow
                key={blk.tKey}
                batch={keyword}
                describe={what}
                tBlock={blk} />
            );
          }
        })}
        </tbody>
      </table>
      }
      <div className='small fadeMore vmargin nopmargin'>
        <p><sup>i.</sup>Times are displayed for timezone: {moment.tz.guess()}</p>
        <p><sup>ii.</sup>Task is from direct user input only</p>
        <p><sup>iii.</sup>Durations are rounded to the nearest minute</p>
      </div>
    </div>
  );
};

export default HistorySlide;


const TidePlainRow = ({ 
  batch, describe, tBlock
})=> {
  
  // const tideKey = tBlock.tKey;
  const tideWho = tBlock.who;
  const durrAsMin = tBlock.durrAsMin;
  const task = tBlock.task;
  
  // const mStart = moment(tBlock.startTime);
  const mStop = tBlock.stopTime && moment(tBlock.stopTime);

  // const staticFormat = Roles.userIsInRole(Meteor.userId(), 'debug') ? 'hh:mm:ss A' : 'hh:mm A';
  
  return(
    <tr className='smTxt'>
      <td className='noRightBorder'><AnonyUser id={tideWho} /></td>
      
      <td className='noRightBorder'>
        <ExploreLinkBlock type='batch' keyword={batch} />
      </td>
      
      <td className='noRightBorder'>{describe}</td>
      
      {/*
      <td className='noRightBorder numFont centreText timeInputs'>
        <i className="fas fa-play fa-fw fa-xs greenT"></i><i> {mStart.format(staticFormat)}</i>
      </td>
      
      <td className='noRightBorder centreText timeInputs'>
        <em><i className="fas fa-long-arrow-alt-right"></i></em>
      </td>
        
      <td className='noRightBorder numFont centreText timeInputs'>
        <i className="fas fa-stop fa-fw fa-xs redT"></i>
        {!mStop ? <i> __:__ __</i> : <i> {mStop.format(staticFormat)}</i>}
      </td>
      */}
      
      <td className='noRightBorder timeInputs'>
        {task ? task : '   '}
      </td>
      
      <td className='noRightBorder clean numFont rightText'>
        {mStop ? Math.round( durrAsMin ) : '...'} minutes
      </td>
      
    </tr>
  );
};