import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

const FloorRelease = ({ id })=> {
  
  const [ datetime, datetimeSet ] = useState( moment().format() );
  
  function handleDatetime(e) {
    const input = this.rDateTime.value;
    datetimeSet( input );
  }
  
  function handleRelease(e, caution) {
    Meteor.call('releaseToFloor', id, datetime, caution, (err)=>{
      err && console.log(err);
    });
  }
  
  let sty = {
    padding: '10px',
  };
  
  return(
    <div className='actionBox centre greenBorder listSortInput' style={sty}>
      <Flatpickr
        id='rDateTime'
        value={datetime}
        onChange={(e)=>handleDatetime(e)}
        options={{
          defaultDate: datetime,
          maxDate: moment().format(),
          minuteIncrement: 1,
          enableTime: true,
          time_24hr: false,
          altInput: true,
          altFormat: "Y-m-d G:i K",
        }}
      />
      <p>
        <button
          onClick={(e)=>handleRelease(e, false)}
          title={`Release ${Pref.batch} to the floor`}
          className='action clearGreen centreText bigger cap'
          style={sty}
          disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
        >Release {Pref.batch} to the floor</button>
      </p>
      <button
        onClick={(e)=>handleRelease(e, Pref.shortfall)}
        title={`Release ${Pref.batch} to the floor`}
        className='smallAction clearOrange cap'
        disabled={!Roles.userIsInRole(Meteor.userId(), 'run')}
      >release with {Pref.shortfall}</button>
    </div>
  );
};
  
export default FloorRelease;