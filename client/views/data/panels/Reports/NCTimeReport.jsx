import React, { useState } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert';
import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const NCTimeReport = ({})=> {
  
  const [ month, monthSet ] = useState(0);
  const [ year, yearSet ] = useState(2020);
  
  const [ working, workingSet ] = useState(false);
  const [ taskData, taskSet ] = useState(false);
  const [ brchData, brchSet ] = useState(false);
  
  const [ lgcyData, lgcySet ] = useState(false);
  
  const yrs = [];
  for(let i = 2020; i > moment().year()+1; i++) {
    yrs.push(i);
  }
  
  
  function testDeduce() {
    Meteor.call('generateNCTimeBacklog', (err, reply)=> {
      err && console.log(err);
      reply && console.log(reply);
      
      
      if(reply) {
        const re = reply[reply.length-2].report;//JSON.parse(reply);
        
  			const sbtotal = re[0].reduce( (x,y)=> x + y[1], 0);
  			const sbtlhrs = min2hr(sbtotal);
			
        taskSet([ 
          ['', 'minutes', 'hours'],
          ['Total', sbtotal, sbtlhrs ],
        	...Array.from(re[0], a =>{ return [ 
        	  a[0], a[1], min2hr(a[1])
        	 ]})
        ]);
        
        brchSet([ 
          ['', 'minutes', 'hours'],
          ...Array.from(re[1], a =>{ return [ 
          	a[0], 
          	Array.from(a[1], b =>{ return [ 
            	b[0], b[1], min2hr(b[1])
            ]})
          ]})
        ]);
        
        if(re[2]) {
          const lgtotal = re[2][0][1].reduce( (x,y)=> x + y[1], 0);
  			  const lgtlhrs = min2hr(lgtotal);
  			
          lgcySet([ 
          ['', 'minutes', 'hours'],
          ['Total', lgtotal, lgtlhrs ],
          ...Array.from(re[2], a =>{ return [ 
          	a[0], 
          	Array.from(a[1], b =>{ return [ 
            	b[0], b[1], min2hr(b[1])
            ]})
          ]})
        ]);
          
          
        }else{
          lgcySet(false);
        }
        
      }
    });
  }
  
  function getReport() {
    workingSet(true);
    Meteor.call('fetchNCTimeMonthly', (err, reply)=> {
      err && console.log(err);
      if(reply) {
        const re = JSON.parse(reply);
        
  			const sbtotal = re[0].reduce( (x,y)=> x + y[1], 0);
  			const sbtlhrs = min2hr(sbtotal);
			
        taskSet([ 
          ['', 'minutes', 'hours'],
          ['Total', sbtotal, sbtlhrs ],
        	...Array.from(re[0], a =>{ return [ 
        	  a[0], a[1], min2hr(a[1])
        	 ]})
        ]);
        
        brchSet([ 
          ['', 'minutes', 'hours'],
          ...Array.from(re[1], a =>{ return [ 
          	a[0], 
          	Array.from(a[1], b =>{ return [ 
            	b[0], b[1], min2hr(b[1])
            ]})
          ]})
        ]);
        
        workingSet(false);
      }
    });
  }
    
  return(
    <div className='overscroll'>
      
      <div className='vmargin noPrint'>
        <label htmlFor="backyear">set year</label>
        <select
          id='backyear'
          className='gap miniIn12'
          value={year}
          onChange={(e)=>yearSet(Number(e.target.value))}
          required>
            {yrs.map( (yr, index)=>(
              <option key={'y'+index} value={yr}>{yr}</option>
            ))}
        </select>
        
        <br />
        
        <label htmlFor="backmonth">set month</label>
        <select
          id='backmonth'
          className='gap miniIn12'
          value={month}
          onChange={(e)=>monthSet(Number(e.target.value))}
          required>
            {["January","Febuary","March","April","May","June",
              "July","August","September","October","November","December"]
              .map( (mth, index)=>(
                <option key={'m'+index} value={index}>{mth}</option>
            ))}
        </select>
        
        <br />
        <button
          className='action nSolid'
          onClick={(e)=>testDeduce(e)} 
        >Test NonCon Time Estimate</button>
      </div>
      
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
        <span>
          <ReportStatsTable 
            title='nonconformance report - task time totals' 
            dateString={`${000} Cached Report`}
            rows={taskData}
            extraClass='max600' 
          />
          <ReportStatsTable 
            title='nonconformance report - branch time' 
            dateString={`${001} Cached Report`}
            rows={brchData}
            extraClass='max600' 
          />
          
          {lgcyData &&
            <ReportStatsTable 
              title='nonconformance report - legacy data' 
              dateString={`${002} Cached Report`}
              rows={lgcyData}
              extraClass='max600' 
            />
          }
        </span>
      }
          
    </div>
  );
};

export default NCTimeReport;

