import React, { useState } from 'react';
import moment from 'moment';
// import business from 'moment-business';
import 'moment-timezone';
import 'moment-business-time-ship';
import '/client/components/utilities/ShipTime.js';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
//import Pref from '/client/global/pref.js';

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
    Meteor.call('addNonWorkDay', newDate, (err, re)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  function handleRemove(wild) {
    const badDate = !wild ? dateState : wildState;
    Meteor.call('removeNonWorkDay', badDate, (err, re)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  function handleReset() {
    Meteor.call('resetNonWorkDay', (err, re)=>{
      err && console.log(err);
      console.log(re);
    });
  }
  
  const nWD = app.nonWorkDays || [];
  const sortList = nWD.sort();
  
  const isAuth = Roles.userIsInRole(Meteor.userId(), 'admin') ||
                 Roles.userIsInRole(Meteor.userId(), 'peopleSuper');

  
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
          onClick={()=>handleTest()}
          disabled={!isAuth}>Test {dateState}</button>
      </div>
      
      <div className='vspace balance'>
        
        <button 
          className='action'
          onClick={()=>handleAdd(false)}
          disabled={!isAuth}>Add {dateState}</button>
        
        <button
          className='action'
          onClick={()=>handleRemove(false)}
          disabled={!isAuth}>Remove {dateState}</button>
        
      </div>
      
      <div className='vspace balance'>
          
        <button 
          className='action'
          onClick={()=>handleAdd(true)}
          disabled={!isAuth}>Add {wildState}</button>
        
        <button
          className='action'
          onClick={()=>handleRemove(true)}
          disabled={!isAuth}>Remove {wildState}</button>
        
      </div>
      
      <div className='vspace balance'>
        <ul>
        {sortList.map( (e, i)=>{
            return( <li key={i}>{e}</li> );
          })
        }
        </ul>
      
        <button
          className='action'
          onClick={()=>handleReset()}
          disabled={!isAuth}>RESET ALL</button>
      </div>
    </div>
  );
};

export default ScheduleSlide;