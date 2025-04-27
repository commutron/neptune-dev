import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { HolidayCheck } from '/client/utility/WorkTimeCalc.js';
import Pref from '/client/global/pref.js';
import PrintThis from '/client/components/tinyUi/PrintThis';
import { CalcSpin } from '/client/components/tinyUi/Spin';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import NumStat from '/client/components/tinyUi/NumStat';
import AvgStat from '/client/components/tinyUi/AvgStat';

import ReportBasicTable from '/client/components/tables/ReportBasicTable'; 

const DailyReport = ({ dayIFin, app, user, isDebug })=> {
  
  const [ dateString, setDateString ] = useState(moment().format('YYYY-MM-DD'));
  const [ dayData, setDayData ] = useState(false);
  
  function getData() {
    setDayData(false);
    Meteor.call('fetchFinishOnDay', dateString, (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=> 
	                        x1[4] > x2[4] ? 1 : x1[4] < x2[4] ? -1 : 0 );
      cronoTimes.unshift([
          Pref.xBatch, 'sales order', 'product', 'serial number', 'time'
        ]);
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
  
  let minDate = moment(app.createdAt).format('YYYY-MM-DD');
  
  const clientTZ = moment.tz.guess();
  const localDate = moment.tz(dateString, clientTZ);
  const isHoliday = HolidayCheck( app, moment(dateString, 'YYYY-MM-DD').format());
                      
  return(
    <div className='space36v overscroll'>
      <div className='med vbreak comfort beside noPrint'>
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
              altFormat: "F J"
            }} />
            <br />
            <span className='bigger breath numFont'
              > {localDate.year()}<sub>d</sub>{localDate.dayOfYear()} </span>
            <br />
            {isHoliday ? <span className='bigger line05x'>Holiday</span> : null}
        </div>
        
        <NumStat
          num={dayData && dayData.length-1}
          name={'Completed ' + Pref.items}
          color='purpleT'
          size='bigger' />
        
        <AvgStat 
          num={dayIFin && dayIFin.dataNum} 
          trend={dayIFin && dayIFin.dataTrend}
          type={'avg ' + Pref.items} />
        
        <PrintThis />
      </div>
      
      {!dayData ?
        <CalcSpin />
      :
      dayData.length === 0 ?
        <div>
          <p className='centreText'><i className="fas fa-ghost fa-4x grayT fade"></i></p>
          <p className='medBig centreText line3x'>No completed on this day</p>
        </div>
      :
      
      <ReportBasicTable 
        title={`completed ${Pref.items} report`}
        dateString={dateString}
        rows={dayData}
      />
      }
      
    </div>
  );
};

export default DailyReport;