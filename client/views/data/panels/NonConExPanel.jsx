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
  
  console.log(start, end);
  
  return(
    <div className='centreBox overscroll2x'>
      <div className='rowWrapR noPrint'><PrintThis /></div>
      
      <div className='space'>
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
      </div>
      
      <div className='space'>
        <h2 style={{marginBottom:'32px'}}>NonCon Types Report</h2>
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
        <h2 style={{marginBottom:'32px'}}>Percent Items NonCon Report</h2>
        
        <NCItemsPercent 
          start={start} 
          end={end}
          branch={branch}
          app={app}
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

const NCItemsPercent = ({ start, end, branch, app })=> {
  
  function getReport() {
    // workingSet(true);
    Meteor.call('getBrNcItemsPercent', branch, start, end, (err, reply)=> {
      err && console.log(err);
      if(reply) {
        
        // workingSet(false);
        // replySet(arrange);
        
        console.log(reply);
      }
    });
  }
  
  function gettesttwo() {
    // workingSet(true);
    Meteor.call('TESTbxLoop', branch, start, end, (err, reply)=> {
      err && console.log(err);
      if(reply) {
        
        // workingSet(false);
        // replySet(arrange);
        
        console.log(reply);
      }
    });
  }
  
  return(
    <div className='vmarginhalf noPrint'>
      <button 
        className='action blackSolid'
        onClick={(e)=>getReport(e)} 
        disabled={!start || !end}
      >Get Percent Report</button>
      
      <hr />
      
      <button 
        className='action blackSolid'
        onClick={(e)=>gettesttwo(e)} 
        disabled={!start || !end}
      >Test Batch Loop</button>
    </div>
  );
};