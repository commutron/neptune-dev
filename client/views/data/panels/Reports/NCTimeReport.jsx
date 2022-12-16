import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert';
import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const NCTimeReport = ({})=> {
  
  const [ working, workingSet ] = useState(false);
  const [ replyData, replySet ] = useState(false);
  
  
  function testDeduce() {
    Meteor.call('generateNCTimeBacklog', (err, reply)=> {
      err && console.log(err);
      reply && console.log(reply);
    });
  }
  
  function getReport() {
    workingSet(true);
    Meteor.call('fetchNCTimeMonthly', (err, reply)=> {
      err && console.log(err);
      if(reply) {
        const re = JSON.parse(reply);
        
        const brtotal = re[0].reduce( (x,y)=> x + y[1], 0);
  			const brtlhrs = min2hr(brtotal);
  			const sbtotal = re[1].reduce( (x,y)=> x + y[1], 0);
  			const sbtlhrs = min2hr(sbtotal);
			
        let arrange = [ 
          [
            [Pref.branches, 'minutes', 'hours'],
            [
            	['Total', brtotal, brtlhrs ],
            	...Array.from(re[0], a =>{ return [ 
            	  a[0], a[1], min2hr(a[1])
            	 ]})
            ]
          ],
        	 
        	[
          	['Task', 'minutes', 'hours'],
          	[
            	['Total', sbtotal, sbtlhrs ],
            	...Array.from(re[1], a =>{ return [ 
            	  a[0], a[1], min2hr(a[1])
            	 ]})
            ]
          ]
        ];
        
        workingSet(false);
        replySet(arrange);
      }
    });
  }
    
  return(
    <div className='overscroll'>
      
      <p className='vmargin'>
        <button 
            className='action nSolid'
            onClick={(e)=>testDeduce(e)} 
          >Test NonCon Time Estimate</button>
      </p>
      
      <p>The previous month's report is generated on the first of each month.</p>
      
      <div className='vmarginhalf noPrint'>
        <button 
          className='action blackSolid'
          onClick={(e)=>getReport(e)} 
          disabled={working}
        >Fetch NonCon Time Report</button>
      </div>
        
      {working ?
        <p><n-fa0><i className='fas fa-spinner fa-lg fa-spin gapL'></i></n-fa0></p>
      :
        <ReportStatsTable 
          title='nonconformance time report' 
          dateString={`${000} Cached Report`}
          rows={replyData}
          extraClass='max600' 
        />
      }
          
    </div>
  );
};

export default NCTimeReport;

