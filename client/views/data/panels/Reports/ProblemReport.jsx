import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect.jsx';
import ReportStatsTable from '/client/components/tables/ReportStatsTable.jsx'; 

const ProblemReport = (props)=> {
  
  const [ working, workingSet ] = useState(false);
  
  const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ dataset, datasetSet ] = useState('noncon');

  const [ replyData, replySet ] = useState(false);
  
  function getReport() {
    workingSet(true);
    replySet(false);
    Meteor.call('buildProblemReport', start, end, dataset, (err, reply)=> {
      err && console.log(err);
      if(reply) {
        const re = JSON.parse(reply);
        let arrange = [
          ['Included ' + Pref.batches, re.batchInclude ],
          [ 'Included Serialized Items', re.itemsInclude ],
          [ 'Finished Serialized Items', re.itemStats.finishedItems ],
          [ 'Scrapped Serialized Items', re.itemStats.scraps ],
          [ 'Failed Tests', re.itemStats.testFail ],
        ];
        const prob = dataset === 'noncon' ? 
          [
            [ 'Discovered Non-conformances', re.nonConStats.foundNC ],
            [ 'Items with Non-conformances', re.nonConStats.uniqueSerials ],
            [ 'Non-conformance Types', re.nonConStats.typeBreakdown ],
            [ 'Non-conformance Departments', re.nonConStats.whereBreakdown ],
          ] : [
            [ 'Discovered Shortfalls', re.shortfallStats.foundSH ],
            [ 'Items with Shortfalls', re.shortfallStats.uniqueSerials ],
            [ 'Part Shortfall Numbers', re.shortfallStats.numBreakdown ],
          ];
        workingSet(false);
        replySet([...arrange,...prob]);
      }
    });
  }
    
  return(
    <div className='overscroll'>
      <div className='centre wide space noPrint'>
          
        <ReportRangeRequest 
          setFrom={(v)=>startSet(v)}
          setTo={(v)=>endSet(v)}
          setData={(v)=>datasetSet(v)} />
        
        <div className='space'>
          <button 
            className='action clearWhite'
            onClick={(e)=>getReport(e)} 
            disabled={!start || !end || working}
          >Generate Report</button>
        </div>
        
      </div>
        
      {working ?
        <div>
          <p className='centreText'>This may take a while...</p>
          <CalcSpin />
        </div>
      :
        <ReportStatsTable 
          title='problem report' 
          dateString={`${start}to${end}`}
          rows={replyData}
          extraClass='max500' />
      }
          
    </div>
  );
};

export default ProblemReport;

const ReportRangeRequest = ({ 
  setFrom, setTo, setData
})=> (
  <div>
    <form id='formR' className=''>
      
      <p>
        <DateRangeSelect
          setFrom={setFrom}
          setTo={setTo} />
      </p>
      
      <div className='centreRow'>
        <span className='middle'>
          <input
            type='radio'
            id='inputNC'
            name='inputData'
            onChange={(e)=>setData('noncon')}
            defaultChecked={true} />
          <label htmlFor='inputNC'>Non-conformances</label>
        </span>
        <span className='middle'>
          <input
            type='radio'
            id='inputSH'
            name='inputData'
            onChange={(e)=>setData('short')} />
          <label htmlFor='inputSH'>Shortfalls</label>
        </span>
      </div>
      
    </form>
  </div>
);

