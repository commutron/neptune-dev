import React, { useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

import Flatpickr from 'react-flatpickr';
//import 'flatpickr/dist/themes/airbnb.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/plugins/monthSelect/style.css';

import ReportStatsTable from '/client/components/tables/ReportStatsTable.jsx'; 

const MonthKPIReport = ({ isDebug })=> {
  
  const [ working, workingSet ] = useState(false);
  
  const [ dateString, setDateString ] = useState(moment().format('YYYY-MM-DD'));
  const [ monthDataState, monthDataSet ] = useState(false);
  
  function handleRun(fresh) {
    workingSet(true);
    monthDataSet(false);
    if(dateString) {

      Meteor.call('reportOnMonth', dateString, (err, reply)=>{
  	    err && console.log(err);
  	    if(reply) {
  	      const rtn = JSON.parse(reply);
    	    let arrange = [
            [`${Pref.batches} Created`, rtn.newBatch ],
            [`${Pref.batches} Completed On Time`, rtn.doneBatchOnTime ],
            [`${Pref.batches} Completed Late`, rtn.doneBatchLate ],
            [`${Pref.items} Created`, rtn.newItem ],
            [`${Pref.items} Completed`, rtn.doneItem ],
            [`${Pref.groups} Created`, rtn.newGroup ],
            [`${Pref.widgets} Created`, rtn.newWidget ],
            [`${Pref.variants} Created`, rtn.newVariant ],
            ['Users Created', rtn.newUser ],
            [`Total ${Pref.tide} Minutes`, rtn.tttMinutes ],
            [`Total ${Pref.tide} Hours`, rtn.tttHours ],
          ];
          monthDataSet(arrange);
          workingSet(false);
        }
        isDebug && console.log(rtn);
  	  });
    }
  }
  
  function setMonth(input) {
    const date = moment(input[0]).format('YYYY-MM-DD') || 
                 moment().format('YYYY-MM-DD');
    setDateString(date);
  }

    
  return(
    <div className='wide'>
        
      <div className='med line2x'>
        
        <Flatpickr
          value={moment().format('YYYY-MM-DD')}
          onChange={(e)=>setMonth(e)} 
          options={{
            disableMobile: "true",
          
            altInput: true,
            altInputClass: 'variableInput medBig',
            defaultDate: moment().format("YYYY-MM-DD"),
            maxDate: moment().format("YYYY-MM-DD"),
            plugins: [
              new monthSelectPlugin({
                dateFormat: "Y-m-d",
                altFormat: "F Y"
              })
            ]}} 
        />
          
        <button
          className='action clearBlack'
          onClick={()=>handleRun()}
          disabled={working}
        >Run Report</button>
       
      </div>

      
      {working ?
        <div>
          <p className='centreText'>This may take a while...</p>
          <CalcSpin />
        </div>
      :   
        <ReportStatsTable 
          title='monthly report'
          dateString={`${dateString}`}
          rows={monthDataState}
          extraClass='max500' />
      }
           
    </div>
  );
};
  
export default MonthKPIReport;