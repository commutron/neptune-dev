import React, { useState } from 'react';
// import Pref from '/client/global/pref.js';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import PrintThis from '/client/components/tinyUi/PrintThis';
import MonthKPIReport from './MonthKPIReport'; 
import ProblemReport from './ProblemReport';

const ReportsWrap = ({ 
  allXBatch, allWidget, allVariant, allGroup,
  app, isDebug, isNightly
})=> {
  
  const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ dataset, datasetSet ] = useState('stats');

  return(
    <div className='space2v'>
      
      <div className='rowWrapR noPrint'><PrintThis /></div>
      
      <div className='centre vmarginhalf noPrint'>
          
        <ReportRangeRequest 
          setFrom={(v)=>startSet(v)}
          setTo={(v)=>endSet(v)}
          setData={(v)=>datasetSet(v)} 
        />
        
      </div>
      
      {dataset === 'stats' ?
        <MonthKPIReport 
          start={start} 
          end={end} 
          dataset={dataset}
          isDebug={isDebug} 
        />
      :      
        <ProblemReport 
          start={start} 
          end={end} 
          dataset={dataset} 
        />
      }

    </div>
  );
};
  
export default ReportsWrap;

const ReportRangeRequest = ({ 
  setFrom, setTo, setData
})=> (
  <div>
    <h3 className='centreText'>Date Range</h3>
      
    <p>
      <DateRangeSelect
        setFrom={setFrom}
        setTo={setTo} />
    </p>
      
    <div className='centreRow'>
      <span className='middle'>
        <input
          type='radio'
          id='inputStats'
          name='inputData'
          onChange={(e)=>setData('stats')}
          defaultChecked={true} 
        />
        <label htmlFor='inputStats'>Overall Stats</label>
      </span>
      <span className='middle'>
        <input
          type='radio'
          id='inputNC'
          name='inputData'
          onChange={(e)=>setData('noncon')}
        />
        <label htmlFor='inputNC'>Non-conformances</label>
      </span>
      <span className='middle'>
        <input
          type='radio'
          id='inputSH'
          name='inputData'
          onChange={(e)=>setData('short')}
        />
        <label htmlFor='inputSH'>Shortfalls</label>
      </span>
    </div>
      
  </div>
);