import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { asRate, percentOf } from '/client/utility/Convert';

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
        const rpdOfComp = percentOf(re.itemStats.completedItems, re.itemStats.itemsRapid);
        const failOfComp = percentOf(re.itemStats.completedItems, re.itemStats.itemsFail);
        
        const nciOfComp = percentOf(re.itemsInclude, re.nonConStats.uniqueSerials);
        const shiOfComp = percentOf(re.itemStats.completedItems, re.shortfallStats.uniqueSerials);
        
        const cleanItms = Math.max( re.itemsInclude - re.nonConStats.uniqueSerials, 0);
        const clnOfComp = percentOf(re.itemsInclude, cleanItms);
        
        const scrpInComp = percentOf(re.nonConItemStats.completedNum, re.nonConItemStats.scraps);
        const rpdInComp = percentOf(re.nonConItemStats.completedNum, re.nonConItemStats.itemsRapid);
        const failInComp = percentOf(re.nonConItemStats.completedNum, re.nonConItemStats.itemsFail);
        
        const badPrc = percentOf(re.nonConItemStats.completedNum, re.nonConItemStats.ncItemsNum);
        const goodFinItms = Math.max( re.nonConItemStats.completedNum - re.nonConItemStats.ncItemsNum, 0);
        const goodPrc = percentOf(re.nonConItemStats.completedNum, goodFinItms);
        const doneNCrate = asRate(re.nonConItemStats.ncTotalNum, re.nonConItemStats.completedNum);
        const badNCrate = asRate(re.nonConItemStats.ncTotalNum, re.nonConItemStats.ncItemsNum);
        
        let arrange = dataset === 'completed' ?
          [ 
            ['', 'total', 'percent'],
            [ `Completed Items`, re.nonConItemStats.completedNum ],
            [ 'Scrapped Items', re.nonConItemStats.scraps, scrpInComp+'%' ],
            [ 'Returned/Reprocessed Items', re.nonConItemStats.itemsRapid, rpdInComp+'%' ],
            [ 'Total Failed Tests', re.nonConItemStats.testFail ],
            [ 'Items That Failed', re.nonConItemStats.itemsFail, failInComp+'%'],
            [ `Completed Items With ${Pref.nonCons}`, re.nonConItemStats.ncItemsNum, badPrc+'%' ],
            [ `Completed Items Without ${Pref.nonCons}`, goodFinItms, goodPrc+'%' ],
            [ `Total ${Pref.nonCons} Of Completed Items`, re.nonConItemStats.ncTotalNum ],
            [ `Rate Among All Completed Items`, doneNCrate  ],
            [ `Rate Among Completed Items With ${Pref.nonCons}`, badNCrate,  ],
          ]
        :
        [
          ['', 'total', 'percent'],
          ['Live ' + Pref.xBatchs, re.seriesInclude ],
          [ 'Live Serialized Items', re.itemsInclude ],
          [ 'Completed Serialized Items', re.itemStats.completedItems ],
          [ 'Scrapped Serialized Items', re.itemStats.scraps, scrpOfComp+'%' ],
          [ 'Returned/Reprocessed Items', re.itemStats.itemsRapid, rpdOfComp+'%' ],
          [ 'Total Failed Tests', re.itemStats.testFail ],
          [ 'Failed Serialized Items', re.itemStats.itemsFail, failOfComp+'%' ],
        ];
        
        const prob = dataset === 'noncon' ? 
          [
            [ `Discovered ${Pref.nonCons}`, re.nonConStats.foundNC ],
            [ `Live Items with ${Pref.nonCons}`, re.nonConStats.uniqueSerials, nciOfComp+'%' ],
            [ `Live Items without ${Pref.nonCons}`, cleanItms, clnOfComp+'%' ],
            [ `${Pref.nonCon} Types `, re.nonConStats.typeBreakdown ],
            [ `${Pref.nonCon} Departments`, re.nonConStats.whereBreakdown ],
          ] 
        : dataset === 'short' ? 
          [
            [ `Discovered ${Pref.shortfalls}`, re.shortfallStats.foundSH ],
            [ `Items with ${Pref.shortfalls}`, re.shortfallStats.uniqueSerials, shiOfComp+'%' ],
            [ `${Pref.shortfall} Part Numbers`, re.shortfallStats.numBreakdown ],
          ]
        : [];
        workingSet(false);
        replySet([...arrange,...prob]);
      }
    });
  }
    
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

