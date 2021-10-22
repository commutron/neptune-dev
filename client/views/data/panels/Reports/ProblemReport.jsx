import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { percentOf } from '/client/utility/Convert';

import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 

const ProblemReport = ({ start, end, dataset })=> {
  
  const [ working, workingSet ] = useState(false);
  const [ replyData, replySet ] = useState(false);
  
  useEffect( ()=>{
    replySet(false);
  },[start, end, dataset]);
  
  function getReport() {
    workingSet(true);
    Meteor.call('buildProblemReport', start, end, dataset, (err, reply)=> {
      err && console.log(err);
      if(reply) {
        const re = JSON.parse(reply);
        const scrpOfComp = percentOf(re.itemStats.completedItems, re.itemStats.scraps);
        const nciOfComp = percentOf(re.itemStats.completedItems, re.nonConStats.uniqueSerials);
        const shiOfComp = percentOf(re.itemStats.completedItems, re.shortfallStats.uniqueSerials);
        let arrange = [
          ['', 'total', 'of total'],
          ['Included ' + Pref.xBatchs, re.seriesInclude ],
          [ 'Included Serialized Items', re.itemsInclude ],
          [ 'Finished Serialized Items', re.itemStats.completedItems ],
          [ 'Scrapped Serialized Items', re.itemStats.scraps, scrpOfComp+'%' ],
          [ 'Failed Tests', re.itemStats.testFail ],
        ];
        const prob = dataset === 'noncon' ? 
          [
            [ 'Discovered Non-conformances', re.nonConStats.foundNC ],
            [ 'Items with Non-conformances', re.nonConStats.uniqueSerials, nciOfComp+'%' ],
            [ 'Non-conformance Types', re.nonConStats.typeBreakdown ],
            [ 'Non-conformance Departments', re.nonConStats.whereBreakdown ],
          ] : [
            [ 'Discovered Shortfalls', re.shortfallStats.foundSH ],
            [ 'Items with Shortfalls', re.shortfallStats.uniqueSerials, shiOfComp+'%' ],
            [ 'Part Shortfall Numbers', re.shortfallStats.numBreakdown ],
          ];
        workingSet(false);
        replySet([...arrange,...prob]);
      }
    });
  }
    
  return(
    <div className='overscroll'>
      
      <div className='vmarginhalf noPrint'>
        <button 
          className='action clearBlack'
          onClick={(e)=>getReport(e)} 
          disabled={!start || !end || working}
        >Generate Report</button>
      </div>
        
      {working ?
        <p>This may take a while...<n-fa0><i className='fas fa-spinner fa-lg fa-spin gapL'></i></n-fa0></p>
      :
        <ReportStatsTable 
          title='problem report' 
          dateString={`${start} to ${end}`}
          rows={replyData}
          extraClass='max600' 
        />
      }
          
    </div>
  );
};

export default ProblemReport;

