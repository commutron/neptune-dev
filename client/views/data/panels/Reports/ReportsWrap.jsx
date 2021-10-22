import React, { useState } from 'react';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import PrintThis from '/client/components/tinyUi/PrintThis';
import MonthKPIReport from './MonthKPIReport'; 
import ProblemReport from './ProblemReport';
import BuildHistory from './BuildHistory';

const ReportsWrap = ({ 
  allXBatch, allWidget, allVariant, allGroup,
  app, isDebug
})=> {
  
  const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ dataset, datasetSet ] = useState('stats');

  return(
    <div className='space'>
      
      <div className='rowWrapR noPrint'><PrintThis /></div>
      
      <BuildHistory
        allVariant={allVariant}
        allWidget={allWidget}
        allGroup={allGroup} 
        app={app} 
      />
          
      <hr className='vmargin' />
      <div className='printBr' />
      
      <div className='space'>
        <div className='noPrint'>  
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

    </div>
  );
};
  
export default ReportsWrap;

const ReportRangeRequest = ({ 
  setFrom, setTo, setData
})=> (
  <div>
    <p className='medBig centreRow rowWrap'>
      <i>Find</i>
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
      <em>or</em>
      <span className='middle'>
        <input
          type='radio'
          id='inputNC'
          name='inputData'
          onChange={(e)=>setData('noncon')}
        />
        <label htmlFor='inputNC'>Non-conformances</label>
      </span>
      <em>or</em>
      <span className='middle'>
        <input
          type='radio'
          id='inputSH'
          name='inputData'
          onChange={(e)=>setData('short')}
        />
        <label htmlFor='inputSH'>Shortfalls</label>
      </span>
  
    </p>
    
    <p className='rowWrap medBig'>
      <i>Within Date Range</i>
      <DateRangeSelect
        setFrom={setFrom}
        setTo={setTo} />
    </p>
      
  </div>
);