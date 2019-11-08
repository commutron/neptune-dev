import React, { useState, useEffect } from 'react';
import moment from 'moment';
import business from 'moment-business';
import 'moment-timezone';
import 'moment-business-time-ship';
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

const GuessSlide = ({ app, user, users, pCache })=> {
  
  const [ numState, numSet ] = useState(false);
  
  useEffect( ()=> {
    const q2tArr = Array.from(pCache.dataSet, 
      x => x.quote2tide > 0 && x.quote2tide );
    const q2tTotal = q2tArr.reduce( 
      (arr, x)=> typeof x === 'number' && arr + x, 0 );
      
    const howManyHours = moment.duration(q2tTotal, "minutes")
                          .asHours().toFixed(2, 10);
    
    // not really, cause that would be one person
    const noMoreDate = moment().addWorkingTime(q2tTotal, 'minutes');
    
    const howManyDays = noMoreDate.workingDiff(moment(), 'days');
    
    numSet([
      ['q2tTotal', q2tTotal],
      ['howManyHours', howManyHours], 
      ['noMoreDate', noMoreDate.format()], 
      ['howManyDays', howManyDays] 
    ]);
  }, []);
  
  
  return(
    <div className='space5x5'>
      <dl>
        {!numState ? 'sure' :
          numState.map( (entry, index)=>{
          return(
            <dd key={index}>{entry[0]}: {entry[1]}</dd>
        )})}
      </dl>
    </div>
  );
};

export default GuessSlide;