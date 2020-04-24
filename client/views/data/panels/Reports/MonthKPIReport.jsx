import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

import Flatpickr from 'react-flatpickr';
//import 'flatpickr/dist/themes/airbnb.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/plugins/monthSelect/style.css';

import ReportStatsTable from '/client/components/tables/ReportStatsTable.jsx'; 

const MonthKPIReport = ({ batchData, widgetData, groupData, app })=> {
  
  const [ dateString, setDateString ] = useState(moment().format('YYYY-MM-DD'));
  const [ monthDataState, monthDataSet ] = useState(false);
  
  
  function getData(fresh) {
    fresh && monthDataSet(false);
    if(dateString) {

      const clientTZ = moment.tz.guess();

      Meteor.call('reportOnMonth', clientTZ, dateString, (err, rtn)=>{
  	    err && console.log(err);
  	    if(rtn) {
    	    let arrange = [
            [`${Pref.batches} Created`, rtn.newBatch ],
            [`${Pref.batches} Completed On Time`, rtn.doneBatchOnTime ],
            [`${Pref.batches} Completed Late`, rtn.doneBatchLate ],
            [`${Pref.items} Created`, rtn.newItem ],
            [`${Pref.items} Completed`, rtn.doneItem ],
            [`${Pref.nonCons} Discovered`, rtn.noncon ],
            ['Shortfalls Discovered', rtn.shortfall ],
            [`${Pref.items} Scrapped`, rtn.scrap ],
            [`${Pref.items} Passed Test`, rtn.itemTestPass ],
            [`${Pref.groups} Created`, rtn.newGroup ],
            [`${Pref.widgets} Created`, rtn.newWidget ],
            [`${Pref.version}s Created`, rtn.newVersion ],
            ['Users Created', rtn.newUser ],
            [`Total ${Pref.tide} Minutes`, rtn.tttMinutes ],
            [`Total ${Pref.tide} Hours`, rtn.tttHours ],
          ];
          monthDataSet(arrange);
        }
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(rtn);

  	  });
  	  
    }
  }
  
  function setMonth(input) {
    const date = moment(input[0]).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    console.log(date);
    setDateString(date);
  }
  
  useEffect( ()=>{
    getData(true);
  }, [dateString]);

    
  return(
    <div className='wide'>
        
      <div className='med line2x'>
        
        <Flatpickr
          value={moment().format('YYYY-MM-DD')}
          onChange={(e)=>setMonth(e)} 
          options={{
            // dateFormat: "Y-m-d",
            // altFormat: "F Y",
            altInput: true,
            defaultDate: moment().format("YYYY-MM-DD"),
            maxDate: moment().format("YYYY-MM-DD"),
            plugins: [
              new monthSelectPlugin({
                dateFormat: "Y-m-d",
                altFormat: "F Y"
              })
            ]}} 
          />
       
      </div>

      
      {monthDataState === false ?
          <div>
            <p className='centreText'>This may take a while...</p>
            <CalcSpin />
          </div>
        :   
        <ReportStatsTable 
          title={`monthly report`}
          dateString={`${dateString}`}
          rows={monthDataState} />
      }
           
    </div>
  );
};
  
export default MonthKPIReport;