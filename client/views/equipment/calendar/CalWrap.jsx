import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';

import CalComp from './CalComp';

const CalWrap = ()=> {
  
  const mounted = useRef(true);
  // const [ work, workSet ] = useState(false);
  const [ float, floatSet ] = useState( false );
  
  const [ events, eventsSet ] = useState([]);
  
  function getEvents(dateStr) {
  	// workSet(true);
  	
  	const date = new Date(dateStr);
		
		if( date.getMonth() === ( float && float.getMonth() ) ) {
			null;
		  // workSet(false);
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
    			// workSet(false);
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
  
  return(
	  <div className='space3v vmarginhalf'>
	  	{/*<div className='rowWrap vmarginquarter'>
	  		<span>{work ?
          <n-fa0><i className='fas fa-spinner fa-lg fa-spin'></i></n-fa0> :
          <n-fa1><i className='fas fa-spinner fa-lg'></i></n-fa1>
        }</span>
	  	</div>*/}
	  	<CalComp
	  	  events={events}
	  	  getEvents={getEvents}
	  	  defaultView='week'
	  	  height='70vh'
	  	/>
	  </div>
  );
};

export default CalWrap;