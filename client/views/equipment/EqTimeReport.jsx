import React, { useState } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 
import { min2hr, asRate, percentOf } from '/client/utility/Convert';

const EqTimeReport = ({})=> {
	
	const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ working, workingSet ] = useState(false);
	
	const [ eqData, eqSet ] = useState(false);
	const [ brData, brSet ] = useState(false);
	
	function handleEquipReport() {
		workingSet(true);
		
		
		Meteor.call('fetchEqTimeReport', start, end, (err, re)=> {
			err && console.log(err);
			
			workingSet(false);
      eqSet([
      	['', 'PM', 'Fix'],
      	...Array.from(re[0], a =>{ return [ a[0], a[2], a[3] ]}),
      ]);
      	
      brSet([
      	['', 'PM', 'Fix'],
	    	...Array.from(re[1], a =>{ return [ a[0], a[1], a[2] ]}),
      ]);
      
      // console.log([...test,...test2]);
      
		});
	}
	
	return(
		<div className='overscroll'>
		
			<span className='fa-stack fa-fw fa-2x'>
	      <i className="fa-solid fa-clock fa-stack-1x" data-fa-transform="shrink-6 left-3 down-3"></i>
	      <i className="fa-regular fa-clipboard fa-stack-1x"></i>
	    </span>
            
            
			<p className='rowWrap'>
        <i>Within Date Range</i>
        <DateRangeSelect
          setFrom={(v)=>startSet(v)}
          setTo={(v)=>endSet(v)} />
      </p>
      
      
      <div className='vmarginhalf noPrint'>
        <button 
          className='action blackSolid'
          onClick={(e)=>handleEquipReport(e)} 
          disabled={!start || !end || working}
        >Generate Report</button>
      </div>
        
      {working ?
        <p>This may take a while...<n-fa0><i className='fas fa-spinner fa-lg fa-spin gapL'></i></n-fa0></p>
      :
        <span>
        <ReportStatsTable 
          title='Equipment Time Report' 
          dateString={`${start} to ${end}`}
          rows={eqData}
          extraClass='max600' 
        />
        
        <ReportStatsTable 
          title='Department Time report' 
          dateString={`${start} to ${end}`}
          rows={brData}
          extraClass='max600' 
        />
        </span>
      }
      
    </div>    
  );
};

export default EqTimeReport;