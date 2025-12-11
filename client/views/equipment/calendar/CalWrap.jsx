import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';

import CalComp from './CalComp';
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';

const CalWrap = ({ brancheS })=> {
  
  const mounted = useRef(true);
  const [ brKey, brKeySet ] = useState(null);
  const [ work, workSet ] = useState(false);
  const [ float, floatSet ] = useState( false );
  
  const [ events, eventsSet ] = useState([]);
  
  const handleEqBr = (val)=> {
  	brKeySet(val === 'false' ? null : val === '0undefined' ? false : val);
  };
  
  function getEvents(dateStr, force) {
  	workSet(true);
  	
  	const date = new Date(dateStr);
		
		if( !force && date.getMonth() === ( float && float.getMonth() ) ) {
			null;
		  workSet(false);
		}else{
		  floatSet(date);
    	const startDate = moment(date).startOf('month').startOf('week').format();
    	const endDate = moment(date).endOf('month').endOf('week').format();
  		
  		const incDone = moment().isSameOrAfter(startDate);
  		const incNext = moment().isSameOrBefore(endDate);
  
    	Meteor.call('predictMonthService', startDate, endDate, incDone, incNext, brKey,
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
  	getEvents( new Date(), true );
  }, [brKey]);

  return(
	  <div className='uspace vmarginhalf'>
	  	{work ?	<div className='pulseload'></div> : null}
	  	
	  	<div className='rowWrapR'>
		  	<FilterSelect
	        unqID='fltrEQbranch'
	        title='Filter by Branch'
	        selectList={[['0undefined','Unassigned'],...brancheS.map( (br)=>[br.brKey, br.branch])]}
	        selectState={brKey}
	        falsey='All Branches'
	        changeFunc={(v)=>handleEqBr(v.target.value)}
	        icon='fas fa-code-branch'
	        extraClass='minWfit'
	      />
      </div>
        
	  	<CalComp
	  	  events={events}
	  	  getEvents={getEvents}
	  	  defaultView='week'
	  	  height='74dvh'
	  	/>
	  </div>
  );
};

export default CalWrap;