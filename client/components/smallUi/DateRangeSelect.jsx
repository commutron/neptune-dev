import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';

const DateRangeSelect = ({ setNew, setFrom, setTo, doRefresh })=> (

  <div className='miniDateRange'>
    <span>
      <select
        id='scope'
        title='Scope'
        defaultValue={false}
        onChange={(e)=>setNew(scope.value)}>
        <option value='all'>All from Active {Pref.Batch}s</option>
        <option value='new'>Limit to Newly Discovered</option>
      </select>
    </span>
    <span>
      <label htmlFor='startRange'>Between</label>
    </span>
    <span>
      <input
        type='date'
        id='startRange'
        title='From'
        defaultValue={moment().startOf('week').add(1, 'day').format('YYYY-MM-DD')}
        onChange={(e)=>setFrom(startRange.value)} />
    </span>
    <span>
      <label htmlFor='endRange'>and</label>
    </span>
    <span>
      <input
        type='date'
        id='endRange'
        title='To'
        defaultValue={moment().format('YYYY-MM-DD')}
        onChange={(e)=>setTo(endRange.value)} />
    </span>
    <span>
      <button
      title='Refresh'
        className='clearWhite'
        onClick={(e)=>doRefresh(e)}
      ><i className='fas fa-redo'></i></button>
    </span>
  </div>
);
      
export default DateRangeSelect;