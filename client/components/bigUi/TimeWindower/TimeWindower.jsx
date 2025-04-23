import React, { useMemo } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';


const TimeWindower = ({ app, changeCount, changeBracket, stickyValue, sessionSticky })=>{
  
  function handleRange(e) {
    const selection = e.split(',');
    changeCount(Math.abs(selection[0]));
    changeBracket(selection[1]);
    sessionSticky && Session.set(sessionSticky, e);
  }
  
  const floorDate = moment(app.createdAt);
  const maxWeek = useMemo( ()=> { return moment().diff(floorDate, 'week') }, [floorDate] );
  const maxMonth = useMemo( ()=> { return moment().diff(floorDate, 'month') }, [floorDate] );
  const maxYear = useMemo( ()=> { 
    const ceilYear = Math.ceil(moment().diff(floorDate, 'year', true));
    const mostMax = ceilYear >= 2 ? ceilYear : ceilYear + 1;
    return mostMax;
  }, [floorDate] );
  
  const maxWeekOption = <option value={maxWeek+',week'}>{maxWeek}(max) Weeks</option>;
  const maxMonthOption = <option value={maxMonth+',month'}>{maxMonth}(max) Months</option>;

  return(
    <nav>
      <span className='liteTip' data-tip='Filter by time span'>
        <i className='fas fa-filter fa-fw darkgrayT'></i>
        <select
          id='rangeSelect'
          className='overToolSort liteToolOn'
          defaultValue={stickyValue}
          onChange={(e)=>handleRange(e.target.value)}
          required>
          <option value={'2,week'}>2 Weeks</option>
          {maxWeek < 6 ? maxWeekOption : 
            <option value={'6,week'}>6 Weeks</option>}
          {maxWeek > 6 && maxWeek < 12 ? maxWeekOption : 
            <option value={'12,week'}>12 Weeks</option>}
          
          {maxWeek < 6 ? maxMonthOption : 
            <option value='6,month'>6 Months</option>}
          {maxMonth > 6 && maxMonth < 12 ? maxMonthOption :
            <option value='12,month'>12 Months</option>}
          {maxMonth > 12 && maxMonth < 18 ? maxMonthOption :
            <option value={'18,month'}>18 Months</option>}
          {maxMonth > 18 && maxMonth < 24 ? maxMonthOption :
            <option value={'24,month'}>24 Months</option>}
            
          {maxYear < 2 ? null : 
            <option value={maxYear+',year'}>{maxYear}(max) Years</option>}
        </select>
      </span>
    </nav>
  );
};

export default TimeWindower;