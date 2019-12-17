import React, { useMemo } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';



const TimeWindower = ({ app, changeCount, changeBracket })=>{
  
  function handleRange(e) {
    const selection = e.split(',');
    changeCount(Math.abs(selection[0]));
    changeBracket(selection[1]);
  }
  
  const floorDate = moment(app.createdAt);
  const maxWeek = useMemo( ()=> { return moment().diff(floorDate, 'week') }, [floorDate] );
  const maxMonth = useMemo( ()=> { return moment().diff(floorDate, 'month') }, [floorDate] );
  const maxYear = useMemo( ()=> { 
    const ceilYear = Math.ceil(moment().diff(floorDate, 'year', true));
    const mostMax = ceilYear >= 2 ? ceilYear : ceilYear + 1;
    return mostMax;
  }, [floorDate] );
  
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const auth = isNightly && isAdmin;
  
  const maxWeekOption = <option value={maxWeek+',week'} disabled={!auth}>{maxWeek}(max) Weeks</option>;
  const maxMonthOption = <option value={maxMonth+',month'} disabled={!auth}>{maxMonth}(max) Months</option>;

  return(
    <nav>
      <span>
        <i className='fas fa-filter fa-fw grayT'></i>
        <select
          id='rangeSelect'
          title={`Change ${Pref.phase} Filter`}
          className='overToolSort liteToolOn'
          defaultValue='2,week'
          onChange={(e)=>handleRange(e.target.value)}>
          <option value={'2,week'}>2 Weeks</option>
          {maxWeek < 6 ? maxWeekOption : 
            <option value={'6,week'}>6 Weeks</option>}
          {maxWeek > 6 && maxWeek < 12 ? maxWeekOption : 
            <option value={'12,week'}>12 Weeks</option>}
          
          {maxWeek < 6 ? maxMonthOption : 
            <option value='6,month'>6 Months</option>}
          {maxMonth > 6 && maxMonth < 12 ? maxMonthOption :
            <option value='12,month' disabled={!auth}>12 Months</option>}
          {maxMonth > 12 && maxMonth < 18 ? maxMonthOption :
            <option value={'18,month'} disabled={!auth}>18 Months</option>}
          {maxMonth > 18 && maxMonth < 24 ? maxMonthOption :
            <option value={'24,month'} disabled={!auth}>24 Months</option>}
            
          {maxYear < 2 ? null : 
            <option value={maxYear+',year'} disabled={!auth}>{maxYear}(max) Years</option>}
        </select>
      </span>
    </nav>
  );
};

export default TimeWindower;