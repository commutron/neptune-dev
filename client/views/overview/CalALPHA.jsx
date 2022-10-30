import React from 'react';
// import React, { useRef, useState, useEffect } from 'react';
// import moment from 'moment';
// import 'moment-business-time';
// import Pref from '/client/global/pref.js';

// import CalComp from './CalComp';

const CalALPHA = ({ oB, filterBranch })=> {
  
  // const mounted = useRef(true);
  // const [ work, workSet ] = useState(false);
  // const [ float, floatSet ] = useState( false );
  
  // const [ events, eventsSet ] = useState([]);
  
  // function getEvents(dateStr) {
  // 	workSet(true);
  	
  // 	const date = new Date(dateStr);
		
		// if( date.getMonth() === ( float && float.getMonth() ) ) {
		//   workSet(false);
		// }else{
		//   floatSet(date);
  //   	const startDate = moment(date).startOf('month').startOf('week').format();
  //   	const endDate = moment(date).endOf('month').endOf('week').format();
  		
  // 		const incDone = moment().isSameOrAfter(startDate);
  // 		const incNext = moment().isSameOrBefore(endDate);
  
  //   	Meteor.call('', startDate, endDate, incDone, incNext,
  //   		(err, re)=>{
  //   		err && console.log(err);
  //   		if(mounted.current) {
  //   			workSet(false);
  //   			if(re) {
  //   				eventsSet(re);
  //   			}
  //   		}
  //   	});
		// }
  // }
  
  // useEffect( ()=> {
  // 	getEvents( new Date() );
  // }, []);
  
  /*
  const [ brTime, setTime ] = useState([]);
  
  useEffect( ()=> {
  	
  	let timeArr = [];
  	
  	if(Array.isArray(oB)) {
      for(let b of oB) {
        
        Meteor.apply('branchTaskTime', [ b._id ], {wait: true}, (error, reply)=>{
          error && console.log(error);
          if( reply && mounted.current ) { 
            
            for(let t of reply.branchTime) {
              if(t.budget) {
                timeArr.push(
                  [ b.batch, t.branch, Math.max( (t.budget - t.time), 0 ) ]
                );
              //     {
              // 	  title: eq.alias + ' -  ' + match.name,
              // 	  start: match.doneAt,
              // 	  end: match.doneAt,
              // 	  allDay: true,
              // 	  done: true
              // 	});
              }
            }
          
            setTime(timeArr);
          }
        });
      }
  	}
  }, [oB]);
  
  console.log({brTime});
  */
  
  return(
	  <div className='space3v'>
	  	<div className='rowWrap vmarginquarter'>
	  		<span>
	  		{/*work ?
          <n-fa0><i className='fas fa-spinner fa-lg fa-spin'></i></n-fa0> :
          <n-fa1><i className='fas fa-spinner fa-lg'></i></n-fa1>
        */}
        </span>
	  	</div>
	  	{/*<CalComp
	  	  events={events}
	  	  getEvents={getEvents}
	  	  defaultView='month'
	  	/>*/}
	  </div>
  );
};

export default CalALPHA;