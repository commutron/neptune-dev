import React, { useRef, useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
// import Pref from '/client/global/pref.js';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const CalWrap = ({ })=> {
  
  const mounted = useRef(true);
  const [ work, workSet ] = useState(false);
  const [ float, floatSet ] = useState( false );
  
  const [ events, eventsSet ] = useState([]);
  
  function getEvents(dateStr) {
  	workSet(true);
  	
  	const date = new Date(dateStr);
		
		if( date.getMonth() === ( float && float.getMonth() ) ) {
		  workSet(false);
		}else{
		  floatSet(date);
    	const startDate = moment(date).startOf('month').startOf('week').format();
    	const endDate = moment(date).endOf('month').endOf('week').format();
  		
  		const incDone = moment().isSameOrAfter(startDate);
  		const incNext = moment().isSameOrBefore(endDate);
  
    	Meteor.call('predictMonthService', startDate, endDate, incDone, incNext,
    		(err, re)=>{
    		err && console.log(err);
    		if(mounted.current) {
    			workSet(false);
    			if(re) {
    				eventsSet(re);
    			}
    		}
    	});
		}
  }
  
  useEffect( ()=> {
  	getEvents( new Date() );
  }, []);
  
  const dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 0 && {
        style: { backgroundColor: 'rgb(150,150,150,0.1)' }
      }),
      ...(moment(date).day() === 6 && {
        style: { backgroundColor: 'rgb(150,150,150,0.1)' }
      }),
      ...(moment(date).isHoliday() && {
        className: 'yellowGlow'
      }),
    }),
    []
  );
  
  const eventPropGetter = useCallback(
    ({done}) => ({
      ...(done && {
        className: 'green'
      })
    }),
    []
  );

  return(
	  <div className='space3v'>
	  	<div className='rowWrap vmarginquarter'>
	  		<span>{work ?
          <n-fa0><i className='fas fa-spinner fa-lg fa-spin'></i></n-fa0> :
          <n-fa1><i className='fas fa-spinner fa-lg'></i></n-fa1>
        }</span>
	  	</div>
	  	<Calendar
	      localizer={localizer}
	      events={events}
	      startAccessor="start"
	      endAccessor="end"
	      defaultView='month'
	      views={['month', 'week']}
	      style={{ height: '75vh' }}
	      onNavigate={(e)=>getEvents(e)}
	      popup={true}
	      dayPropGetter={dayPropGetter}
	      eventPropGetter={eventPropGetter}
    	/>
	  </div>
  );
};

export default CalWrap;