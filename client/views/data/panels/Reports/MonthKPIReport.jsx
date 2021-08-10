import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const MonthKPIReport = ({ start, end, dataset, isDebug })=> {
  
  const [ working, workingSet ] = useState(false);
  const [ dataState, dataSet ] = useState(false);
  
  useEffect( ()=>{
    dataSet(false);
  },[start, end, dataset]);
  
  function handleRun(fresh) {
    workingSet(true);
    Meteor.call('reportOnMonth', start, end, (err, reply)=>{
	    err && console.log(err);
	    if(reply) {
	      const rtn = JSON.parse(reply);
  	    let arrange = [
          [`${Pref.xBatchs} Created`, rtn.newBatch ],
          [`${Pref.xBatchs} Completed On Time`, rtn.doneBatchOnTime ],
          [`${Pref.xBatchs} Completed Late`, rtn.doneBatchLate ],
          [`${Pref.items} Created`, rtn.newItem ],
          [`${Pref.items} Completed`, rtn.doneItem ],
          [`${Pref.groups} Created`, rtn.newGroup ],
          [`${Pref.widgets} Created`, rtn.newWidget ],
          [`${Pref.variants} Created`, rtn.newVariant ],
          ['Users Created', rtn.newUser ],
          [`Total ${Pref.tide} Minutes`, rtn.tttMinutes ],
          [`Total ${Pref.tide} Hours`, rtn.tttHours ],
        ];
        dataSet(arrange);
        workingSet(false);
      }
      isDebug && console.log(rtn);
	  });
  }
    
  return(
    <div className='wide'>
      
      <div className='vmargin centreText noPrint'>
        <button 
          className='action clearBlack'
          onClick={(e)=>handleRun(e)} 
          disabled={!start || !end || working}
        >Generate Report</button>
      </div>
      
      {working ?
        <div className='centreText'>
          <p>This may take a while...</p>
          <n-fa0><i className='fas fa-spinner fa-lg fa-spin'></i></n-fa0>
        </div>
      :   
        <ReportStatsTable 
          title='monthly report'
          dateString={`${start} to ${end}`}
          rows={dataState}
          extraClass='max500' />
      }
           
    </div>
  );
};
  
export default MonthKPIReport;