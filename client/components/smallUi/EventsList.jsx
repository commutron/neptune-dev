import React from 'react';
import moment from 'moment';

const EventsList = ({events}) =>	{
  
  const eventList = events ? events : [];
  const orderedEvents = eventList.sort((t1, t2)=> {
    if (moment(t1.time).isAfter(t2.time)) { return -1 }
    if (moment(t1.time).isBefore(t2.time)) { return 1 }
    return 0;
  });
  
  return(
    <ul className='eventList'>
      {orderedEvents.map( (entry, index)=>{
        const highlight = moment().isSame(entry.time, 'day') ? 'eventListNew' : '';
        return(
          <li key={entry.time.toISOString()+index} className={highlight}>
            <b>{entry.title}</b>,
            <i> {entry.detail}</i>,
            <em> {moment(entry.time).calendar()}</em>
          </li>
      )})}
    </ul>
  );
};

export default EventsList;
  