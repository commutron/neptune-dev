import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { asRate, percentOf } from '/client/utility/Convert';

import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 
import ReportCrossTable from '/client/components/tables/ReportCrossTable';

const ProblemReport = ({ start, end, dataset })=> {
  
  const [ working, workingSet ] = useState(false);
  const [ replyData, replySet ] = useState(false);
  const [ crossData, crossSet ] = useState(false);
  
  useEffect( ()=>{
    replySet(false);
    crossSet(false);
  },[start, end, dataset]);
  
  function getReport() {
    workingSet(true);
    Meteor.call('buildNonConReport', start, end, (err, reply)=> {
      err && console.log(err);
      if(reply) {
        const re = JSON.parse(reply);
        
        const nciOfComp = percentOf(re.itemsInclude, re.nonConStats.uniqueSerials);

        const cleanItms = Math.max( re.itemsInclude - re.nonConStats.uniqueSerials, 0);
        const clnOfComp = percentOf(re.itemsInclude, cleanItms);
        
        let arrange =
        [
          ['', 'total', 'percent'],
          ['Live ' + Pref.xBatchs, re.seriesInclude ],
          [ `Discovered ${Pref.nonCons}`, re.nonConStats.foundNC ],
          [ `Live Items with ${Pref.nonCons}`, re.nonConStats.uniqueSerials, nciOfComp+'%' ],
          [ `Live Items without ${Pref.nonCons}`, cleanItms, clnOfComp+'%' ]
        ];
        workingSet(false);
        replySet(arrange);
        
        if(re?.nonConStats?.crossref) {
          crossSet(re.nonConStats.crossref);
        }
      }
    });
  }
  
  const title = Pref.nonCons;

  return(
    <div className='overscroll'>
      
      <div className='vmarginhalf noPrint'>
        <button 
          className='action blackSolid'
          onClick={(e)=>getReport(e)} 
          disabled={!start || !end || working}
        >Generate Report</button>
      </div>
        
      {working ?
        <p>This may take a while...<n-fa0><i className='fas fa-spinner fa-lg fa-spin gapL'></i></n-fa0></p>
      :
        <ReportStatsTable 
          title={`KPI report (${title})`}
          dateString={`${start} to ${end}`}
          rows={replyData}
          extraClass='max600' 
        />
      }
      
      <div className='printBr' />
      
      {crossData &&
        <ReportCrossTable 
          title={`Cross Reference (${title})`}
          dateString={`${start} to ${end}`}
          rows={crossData}
          extraClass='max1200'
        />
      }
          
    </div>
  );
};

export default ProblemReport;

