import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import business from 'moment-business';
import 'moment-timezone';
import 'moment-business-time-ship';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
//import Pref from '/client/global/pref.js';

moment.updateLocale('en', {
  workinghours: {
      0: null,
      1: ['07:00:00', '16:30:00'],
      2: ['07:00:00', '16:30:00'],
      3: ['07:00:00', '16:30:00'],
      4: ['07:00:00', '16:30:00'],
      5: ['07:00:00', '12:00:00'],
      6: null
  },// including lunch breaks!
  shippinghours: {
      0: null,
      1: null,
      2: ['11:30:00', '11:30:00'],
      3: null,
      4: ['11:30:00', '11:30:00'],
      5: null,
      6: null
  }// including lunch breaks!
});

// const clientTZ = moment.tz.guess();

const ScheduleSlide = ({ app, user, users, pCache })=> {
  
  const now = moment().format('YYYY-MM-DD');
  const nArr = now.split('-');
  const nString = '*' + '-' + nArr[1] + '-' + nArr[2];
    
  const [ dateState, dateSet ] = useState(now);
  const [ wildState, wildSet ] = useState(nString);
  
  function handleDateChange(e) {
    const dateString = moment(e[0]).format('YYYY-MM-DD');
    const dArr = dateString.split('-');
    const wildString = '*' + '-' + dArr[1] + '-' + dArr[2];
    dateSet(dateString);
    wildSet(wildString);
  }
  
  function handleTest() {
    const testDate = dateState;
    const nonWorkDays = app.nonWorkDays;
    if( Array.isArray(nonWorkDays) ) {  
      moment.updateLocale('en', {
        holidays: nonWorkDays
      });
      if( moment( testDate ).isWorkingDay() ) {
        toast('IS a workday');
      }else{
        toast('is NOT a workday');
      }
    }
  }
  
  function handleAdd(wild) {
    const newDate = !wild ? dateState : wildState;
    Meteor.call('addNonWorkDay', newDate, (re, err)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  function handleRemove(wild) {
    const badDate = !wild ? dateState : wildState;
    Meteor.call('removeNonWorkDay', badDate, (re, err)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  function handleReset() {
    Meteor.call('resetNonWorkDay', (re, err)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  
  return(
    <div className='space5x5'>
      
      <div className='vspace balance'>
        <Flatpickr
          onChange={(e)=>handleDateChange(e)}
          options={{
            dateFormat: "Y-m-d",
            defaultDate: new Date(),
          }} />
          
        <button 
          className='action'
          onClick={()=>handleTest()}>Test {dateState}</button>
      </div>
      
      <div className='vspace balance'>
        
        <button 
          className='action'
          onClick={()=>handleAdd(false)}>Add {dateState}</button>
        
        <button
          className='action'
          onClick={()=>handleRemove(false)}>Remove {dateState}</button>
        
      </div>
      
      <div className='vspace balance'>
          
        <button 
          className='action'
          onClick={()=>handleAdd(true)}>Add {wildState}</button>
        
        <button
          className='action'
          onClick={()=>handleRemove(true)}>Remove {wildState}</button>
        
      </div>
      
      <div className='vspace balance'>
        <ul>
        {app.nonWorkDays ?
          app.nonWorkDays.map( (e, i)=>{
            return( <li key={i}>{e}</li> );
          })
          :
          <li>not setup</li>
        }
        </ul>
      
        <button
          className='action'
          onClick={()=>handleReset()}>RESET ALL</button>
      </div>
    </div>
  );
};

export default ScheduleSlide;