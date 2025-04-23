import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

// import NumStat from '/client/components/tinyUi/NumStat';
import PrintThis from '/client/components/tinyUi/PrintThis';
import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import NCcrossReport from '/client/views/data/panels/Reports/NCcrossReport';
import NCTimeReport from '/client/views/data/panels/Reports/NCTimeReport';

const NonConExPanel = ({ brancheS, request, app })=> {
  
  const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ branch, branchSet ] = useState('ALL');
  
  const bPro = brancheS.filter(b=> b.open && b.pro).map((br)=>br.branch);
  
  return(
    <div className='centreBox overscroll2x'>
      <div className='rowWrapR noPrint'><PrintThis /></div>
      
      <div className='space'>
        <h2>NonCon Reported Report</h2>
        <h4 className='noPrint darkOrangeT medSm'>WARNING: Long Time Ranges Can Delay Production Activities</h4>
        <div className='noPrint max750'>
          <p className='rowWrap'>
            <label className='beside'>
              <input 
                type='radio' 
                name='brSelect' 
                onChange={()=>branchSet('ALL')}
                defaultChecked={true}
              />All
            </label>
            {bPro.map((bp)=>{
              return(
                <label key={bp} htmlFor={bp+'_radio'} className='beside gapR gapL inlineRadio'>
                  <input 
                    id={bp+'_radio'}
                    type='radio' 
                    name='brSelect' 
                    onChange={()=>branchSet(bp)} 
                  />{bp}
                </label>
              )})}
            <label className='beside'>
              <input 
                type='radio' 
                name='brSelect' 
                onChange={()=>branchSet('extend')}
              />{Pref.rapidEx}
            </label>
          </p>
          <p className='rowWrap'>
            <i>Within Date Range</i>
            <DateRangeSelect
              setFrom={startSet}
              setTo={endSet} />
          </p>
        </div>
        
        <NCcrossReport 
          start={start} 
          end={end} 
          dataset='noncon'
          branch={branch}
        />
      </div>
      
      <hr className='vmargin' />
      <div className='printBr' />
      
      <div className='space'>
        <h2 style={{marginBottom:'32px'}}>Monthly NonCon Time Report</h2>
        <NCTimeReport />
      </div>
      
      
    </div>
  );
};

export default NonConExPanel;