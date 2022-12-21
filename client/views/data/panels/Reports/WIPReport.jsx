import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const WIPReport = ({})=> {
  
  const [ working, workingSet ] = useState(false);
  const [ wipData, wipSet ] = useState(false);
  
  function getReport() {
    workingSet(true);
    Meteor.call('fetchOpenApproxTime', (err, reply)=> {
      err && console.log(err);
      if(reply) {
          wipSet([ 
            ['', Pref.xBatchs, 'Quoted Hours', 'Estimated Hours'],
          	...reply
          ]);
        workingSet(false);
      }else{null}
    });
  }
             
  return(
    <div>
      <div className='vmargin noPrint'>
        
        <p className='med line2x'>Hours of work remaining for all live {Pref.xBatchs}.
          <i className='med line2x'> </i>
          
          <button 
            className='action blackSolid gap'
            onClick={(e)=>getReport(e)} 
            disabled={working}
          >Fetch Report</button>
        </p>
        
        {wipData &&
          <p className='smTxt vmarginquarter max600'>"Estimated Hours" incorporates previous product orders, process cycle times and the nonconformance rate. (The same calculation used for priority ranking.)</p>}
      </div>
        
      {working ?
        <p><n-fa0><i className='fas fa-spinner fa-lg fa-spin gapL'></i></n-fa0></p>
      :
        <ReportStatsTable 
          title='Remaining WIP Report'
          dateString={moment().format('MMMM D YYYY')}
          rows={wipData}
          extraClass='max750' 
        />
      }
    </div>
  );
};

export default WIPReport;