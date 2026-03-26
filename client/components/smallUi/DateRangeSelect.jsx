import React, { useState } from 'react';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";
import weekSelectPlugin from "flatpickr/dist/plugins/weekSelect/weekSelect.js";
import 'flatpickr/dist/themes/airbnb.css';
import 'flatpickr/dist/plugins/monthSelect/style.css';

const DateRangeSelect = ({ setFrom, setTo })=> {
  
  const [ invld, invldSet ] = useState('');
  
  function sendUp(e) {
    setFrom( moment(e[0]).format('YYYY-MM-DD') );
    if(e[1]) {
      if(moment(e[1]).diff(moment(e[0]), 'days') < 367) {
        invldSet('');
        setTo( moment(e[1]).format('YYYY-MM-DD') );
      }else{
        setTo(false);
        invldSet('Range too high! Select a range less than 367 days.');
      }
    }
  }
  
  return(
    <span className='colNoWrap'>
      <Flatpickr
        id='startRange'
        title='From'
        className='dbbleWide'
        onChange={(e)=>sendUp(e)}
        required
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F J Y",
          weekNumbers: true,
        }}
      />
      <small style={{minHeight:'20px'}}className='maxWide redT'>{invld}</small>
    </span>
  );
};
      
export default DateRangeSelect;

export const MonthSelect = ({ setDate })=> {
  
  function sendUp(e) {
    setDate( moment(e[0]).format('YYYY-MM-DD') );
  }
  
  return(
    <span className='centreRow rowWrap'>
      <Flatpickr
        id='startRange'
        title='From'
        className='miniIn18'
        onChange={(e)=>sendUp(e)}
        required
        options={{
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F J Y",
          maxDate: new Date(),
          plugins: [
            new monthSelectPlugin({})
          ]
        }}
      />
    </span>
  );
};

export const WeekSelect = ({ setDate })=> {
  
  function sendUp(e) {
    setDate( moment(e[0]).format('YYYY-MM-DD') );
  }
  
  return(
    <span className='centreRow rowWrap'>
      <Flatpickr
        id='startRange'
        title='From'
        className='miniIn24'
        onChange={(e)=>sendUp(e)}
        required
        options={{
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F Y \\Week W",
          weekNumbers: true,
          maxDate: new Date(),
          plugins: [
            new weekSelectPlugin({})
          ]
        }}
      />
    </span>
  );
};