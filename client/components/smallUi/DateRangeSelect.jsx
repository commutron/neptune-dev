import React, {Component} from 'react';
//import Pref from '/client/global/pref.js';
//import moment from 'moment';

const DateRangeSelect = ({ setFrom, setTo })=> ( //setNew, doRefresh

  <span className='miniDateRange'>
    <span>
      <label htmlFor='startRange'>From</label>
      <input
        type='date'
        id='startRange'
        title='From'
        //defaultValue={moment().startOf('week').add(1, 'day').format('YYYY-MM-DD')}
        onChange={(e)=>setFrom(startRange.value)} />
    </span>
    <span>
      <label htmlFor='endRange'>To</label>
      <input
        type='date'
        id='endRange'
        title='To'
        //defaultValue={moment().format('YYYY-MM-DD')}
        onChange={(e)=>setTo(endRange.value)} />
    </span>
  </span>
);
      
export default DateRangeSelect;