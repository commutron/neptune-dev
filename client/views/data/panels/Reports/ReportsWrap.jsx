import React, { useState } from 'react';
// import Pref from '/client/global/pref.js';

import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import PrintThis from '/client/components/tinyUi/PrintThis';
import WIPReport from './WIPReport';
import MonthKPIReport from './MonthKPIReport';
import InDepthReport from './InDepthReport';
import BuildHistory from './BuildHistory';

const ReportsWrap = ({ 
  allWidget, allVariant, allGroup, app, isDebug
})=> {
  
  const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ dataset, datasetSet ] = useState('stats');
  
  return(
    <div className='space overscroll'>
      
      <div className='rowWrapR noPrint'><PrintThis /></div>
      
      <div className='space'>
        <h2 style={{marginBottom:'32px'}}>KPI Report</h2>
        <h4 className='noPrint'>WARNING: Long Time Ranges Can Delay Production Activities</h4>
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
          <InDepthReport 
            start={start} 
            end={end} 
            dataset={dataset} 
          />
        }
      </div>
      
      <hr className='vmargin' />
      <div className='printBr' />
      
      <div className='space'>
        <h2 style={{marginBottom:'32px'}}>Remaining Work In Progress Report</h2>
        <WIPReport />
      </div>
      
      <hr className='vmargin' />
      <div className='printBr' />
      
      <div className='space'>
        <h2>Build History Report</h2>
        <BuildHistory
          allVariant={allVariant}
          allWidget={allWidget}
          allGroup={allGroup} 
          app={app} 
        />
      </div>

    </div>
  );
};
  
export default ReportsWrap;

const ReportRangeRequest = ({ 
  setFrom, setTo, setData
})=> (
  <div>
    <p className='centreRow rowWrap'>
      <i>Find</i>
      <span className='beside'>
        <input
          type='radio'
          id='inputStats'
          name='inputData'
          onChange={()=>setData('stats')}
          defaultChecked={true} 
        />
        <label htmlFor='inputStats'>Basic Summary</label>
      </span>
      <em>or</em>
      <span className='beside'>
        <input
          type='radio'
          id='inputLV'
          name='inputData'
          onChange={()=>setData('live')}
        />
        <label htmlFor='inputLV'>In Depth (Live)</label>
      </span>
      <em>or</em>
      <span className='beside'>
        <input
          type='radio'
          id='inputDN'
          name='inputData'
          onChange={()=>setData('completed')}
        />
        <label htmlFor='inputDN'>In Depth (Completed)</label>
      </span>
    </p>
    
    <p className='rowWrap'>
      <i>Within Date Range</i>
      <DateRangeSelect
        setFrom={setFrom}
        setTo={setTo} />
    </p>
      
  </div>
);