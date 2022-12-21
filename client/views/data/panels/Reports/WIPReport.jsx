import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import { min2hr } from '/client/utility/Convert';
import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const WIPReport = ({})=> {
  
  const n = moment();
  
  const [ working, workingSet ] = useState(false);
  const [ none, noneSet ] = useState(false);
  const [ wipData, wipSet ] = useState(false);
  
  function getReport() {
    workingSet(true);
    Meteor.call('fetchOpenApproxTime', (err, reply)=> {
      err && console.log(err);
      
      
      ////////////////////
      if(reply === false) {
        noneSet(true);
        wipSet(false);
        workingSet(false);
      }else if(reply) {
        const re = reply;
        
        
        console.log(re);
        
          wipSet([ 
            ['', 'Quoted Hours', 'Estimated Hours'],
          	...re
          ]);
        
        noneSet(false);
        workingSet(false);
      }
    });
  }
             
  return(
    <div className='overscroll'>
      
      <div className='vmargin noPrint'>
        
        <p className='med line2x'>Current
        
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
        <ReportStatsTable 
          title='Current Work In Progress Report' 
          dateString={n.format('MMMM D YYYY')}
          rows={wipData}
          extraClass='max600' 
        />
      }
      
      {none &&
        <span className='med centreText'>
          <p className='bold'>No Report Found.</p>
          <p>Reports are auto generated at the end of each month.</p>
        </span>
      }
          
    </div>
  );
};

export default WIPReport;

