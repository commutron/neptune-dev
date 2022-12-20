import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert';
import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const NCTimeReport = ({})=> {
  
  const n = moment();
  const m = n.month()-1;
  const y = n.year();
  
  const [ month, monthSet ] = useState( m >= 0 ? m : 11 );
  const [ year, yearSet ] = useState( m >= 0 ? y : y-1 );
  
  const [ working, workingSet ] = useState(false);
  const [ none, noneSet ] = useState(false);
  const [ taskData, taskSet ] = useState(false);
  const [ brchData, brchSet ] = useState(false);
  
  const [ lgcyData, lgcySet ] = useState(false);
  
  const yrs = [];
  for(let i = 2020; i < y+1; i++) {
    yrs.unshift(i);
  }
  
  function generateBacklog() {
    Meteor.call('generateNCTimeBacklog', (err, reply)=> {
      err && console.log(err);
      reply && console.log(reply);
    });
  }
  
  function generateMonth() {
    Meteor.call('generateNCTimeMonthly', (err, reply)=> {
      err && console.log(err);
      reply && console.log(reply);
    });
  }
  
  function getReport() {
    workingSet(true);
    Meteor.call('fetchCachedNcTimeReport', month, year, (err, reply)=> {
      err && console.log(err);
      if(reply === false) {
        noneSet(true);
        taskSet(false);
        brchSet(false);
        lgcySet(false);
        workingSet(false);
      }else if(reply) {
        const re = reply;
        
        if(re[2].length > 0) {
          taskSet(false);
          brchSet(false);
          
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
        }
        
        noneSet(false);
        workingSet(false);
      }
    });
  }
  
  const blend = { border: 'none', lineHeight: 2 };
  const gen = Roles.userIsInRole(Meteor.userId(), 'admin') &&
              Roles.userIsInRole(Meteor.userId(), 'debug');
              
  return(
    <div className='overscroll'>
      
      {gen &&
        <div className='vmargin noPrint'>
          <button
            className='action tealSolid'
            onClick={(e)=>generateBacklog(e)}
            disabled={!gen}
          >Generate Backlog NonCon Time Reports</button>
        </div>
      }
      
      {gen &&
        <div className='vmargin noPrint'>
          <button
            className='action nSolid'
            onClick={(e)=>generateMonth(e)}
            disabled={!gen}
          >Generate First Monthly NonCon Time Reports</button>
        </div>
      }
      
      <div className='vmargin noPrint'>
        
        <p className='med line2x'>Logged {Pref.nonCon} time for
        
          <i className='med line2x'> </i>
          
          <select
            id='backmonth'
            className='gap miniIn12'
            style={blend}
            value={month}
            onChange={(e)=>monthSet(Number(e.target.value))}
            required>
              {["January","Febuary","March","April","May","June",
                "July","August","September","October","November","December"]
                .map( (mth, index)=>(
                  <option key={'m'+index} value={index}>{mth}</option>
              ))}
          </select>
          
          <i className='med line2x'> </i>
          
          <select
            id='backyear'
            className='gap miniIn8'
            style={blend}
            value={year}
            onChange={(e)=>yearSet(Number(e.target.value))}
            required>
              {yrs.map( (yr, index)=>(
                <option key={'y'+index} value={yr}>{yr}</option>
              ))}
          </select>
          
          <i className='med line2x'> </i>
          
          <button 
            className='action blackSolid gap'
            onClick={(e)=>getReport(e)} 
            disabled={working}
          >Fetch Report</button>
        
        </p>
        
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
            <span>
              <p className='centreText'><em>No direct time records available. Estimate inferred from nonCon records.</em></p>
              <ReportStatsTable 
                title='nonconformance report - Legacy Estimate' 
                dateString={`${002} Cached Report`}
                rows={lgcyData}
                extraClass='max600' 
              />
            </span>
          }
        </span>
      }
      
      {none &&
        <p className='med bold centreText'>No Report Found</p>
      }
          
    </div>
  );
};

export default NCTimeReport;

