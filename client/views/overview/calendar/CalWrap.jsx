import React, { useRef, useState } from 'react';
import moment from 'moment';

import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

import Pref from '/client/global/pref.js';

const CalWrap = ({ })=> {
  
  const mounted = useRef(true);
  const [ events, eventsSet ] = useState([]);
  
  function getEvents(dateStr) {
  	const date = new Date(dateStr);
  	

  	const startDate = moment(date).startOf('month').format();
  	const endDate = moment(date).endOf('month').format();
  	

  	Meteor.call('predictMonthService', startDate, endDate, (err, re)=>{
  		err && console.log(err);
  		
  		
  		console.log(re);
  		
  		if(re && mounted.current) {
  			eventsSet(re);
  		}
  	});

  }
  
  
  console.log(events);
  /*
  Event {
	  title: string,
	  start: Date,
	  end: Date,
	  allDay?: boolean
	  resource?: any,
	}
*/
const eventsfiler = [{
	  title: 'first test event',
	  start: moment().format(),
	  end: moment().add(3, 'days').format(),
	  allDay: true,
	},{
	  title: 'second test event',
	  start: moment().add(1, 'days').format(),
	  end: moment().add(4, 'days').format(),
	  allDay: true,
	},{
	  title: 'something happening next week',
	  start: moment().add(9, 'days').format(),
	  end: moment().add(9, 'days').format(),
	  allDay: true,
	},{
	  title: 'Over the weekend',
	  start: moment().add(4, 'days').format(),
	  end: moment().add(6, 'days').format(),
	  allDay: true,
	},{
	  title: 'One day event',
	  start: moment().add(2, 'days').format(),
	  end: moment().add(2, 'days').format(),
	  allDay: true,
	},{
	  title: 'One day event again',
	  start: moment().add(2, 'days').format(),
	  end: moment().add(2, 'days').format(),
	  allDay: true,
	}];

  return(
	  <div className='space3v'>
	  	<div className='centreRow'>
	  		<span>selecting row</span>
	  	</div>
	  	<Calendar
	      localizer={localizer}
	      events={events}
	      startAccessor="start"
	      endAccessor="end"
	      defaultView='month'
	      views={['month', 'week']}
	      // selectable='ignoreEvents'
	      timeslots={3}
	      step={60*24}
	      style={{ height: '75vh' }}
	      onNavigate={(e)=>getEvents(e)}
	      popup={true}
    	/>
	  </div>
  );
};

export default CalWrap;