import React from 'react';
//import Pref from '/client/global/pref.js';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const DateRangeSelect = ({ setFrom, setTo })=> (

  <span className='centreRow'>
    <span className='beside'>
      <span><i className="fas fa-calendar gap darkgrayT"></i></span>
      <Flatpickr
        id='startRange'
        title='From'
        className='miniIn18'
        onChange={(e)=>setFrom(moment(e[0]).format('YYYY-MM-DD'))}
        required
        options={{
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F J Y",
        }} 
      />
    </span>
    
    <span><i className="fas fa-long-arrow-alt-right"></i></span>
    
    <span className='beside'>
      <span><i className="fas fa-calendar gap darkgrayT"></i></span>
      <Flatpickr
        id='endRange'
        title='To'
        className='miniIn18'
        onChange={(e)=>setTo(moment(e[0]).format('YYYY-MM-DD'))}
        required
        options={{
          dateFormat: "Y-m-d",
          altInput: true,
          altFormat: "F J Y",
        }} 
      />
    </span>
  </span>
);
      
export default DateRangeSelect;