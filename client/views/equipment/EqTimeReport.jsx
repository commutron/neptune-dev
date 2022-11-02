import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import ModelMedium from '/client/components/smallUi/ModelMedium';

import DateRangeSelect from '/client/components/smallUi/DateRangeSelect';
import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 
import { min2hr } from '/client/utility/Convert';

const EqTimeReport = ()=> (
  <ModelMedium
    button='Time Report'
    title={`${Pref.equip} Time Report`}
    color='midnightblueT'
    icon='fa-clipboard'
    lgIcon={true}>
    <EqTimeReportContent />
  </ModelMedium>
);

export default EqTimeReport;

const EqTimeReportContent = ({})=> {
	
	const [ min, minSet ] = useState(false);
	const [ start, startSet ] = useState(false);
  const [ end, endSet ] = useState(false);
  const [ working, workingSet ] = useState(false);
	
	const [ eqData, eqSet ] = useState(false);
	const [ brData, brSet ] = useState(false);
	
	function handleEquipReport() {
		workingSet(true);
		
		Meteor.call('fetchEqTimeReport', start, end, (err, re)=> {
			err && console.log(err);
			workingSet(false);
			
			const pmtotal = re[0].reduce( (x,y)=> x + y[2], 0);
			const pmhrs = min2hr(pmtotal);
			const fxtotal = re[0].reduce( (x,y)=> x + y[3], 0);
			const fxhrs = min2hr(fxtotal);
			
      eqSet([
        ['', Pref.premaintain, Pref.fixmaintain],
      	['Total', min ? `${pmtotal} min` : `${pmhrs} hrs`, min ? `${fxtotal} min` : `${fxhrs} hrs` ],
      	...Array.from(re[0], a =>{ return [ 
      	  a[0], 
      	  min ? `${a[2]} min` : `${min2hr(a[2])} hrs`, 
      	  min ? `${a[3]} min` : `${min2hr(a[3] )} hrs`
      	 ]}),
      ]);
      	
      brSet([
      	['', Pref.premaintain, Pref.fixmaintain],
      	['Total', min ? `${pmtotal} min` : `${pmhrs} hrs`, min ? `${fxtotal} min` : `${fxhrs} hrs` ],
	    	...Array.from(re[1], a =>{ return [ 
	    	  a[0],
	    	  min ? `${a[1]} min` : `${min2hr(a[1])} hrs`, 
      	  min ? `${a[2]} min` : `${min2hr(a[2] )} hrs`
	    	]}),
      ]);
		});
	}
	
	return(
    <div className='space max875 min600'> 
      <div className='rowWrap vmarginquarter noPrint'>
        <i>Display in</i>
        <label className='beside'>
          <input 
            type='radio' 
            name='eqtimereportunit' 
            title='hours'
            className='interInput'
            onChange={()=>minSet(false)}
            defaultChecked={true}
        /> Hours</label>
        <i className='gap'> or </i>
        <label className='beside'>
          <input 
            type='radio' 
            name='eqtimereportunit'
            title='Minutes'
            className='interInput'
            onChange={()=>minSet(true)}
        /> Minutes</label>
      </div>
      <div className='rowWrap vmarginquarter noPrint'>
        <i>Within Date Range</i>
        <DateRangeSelect
          setFrom={(v)=>startSet(v)}
          setTo={(v)=>endSet(v)} 
        />
        <button 
          className='smallAction blackHover'
          onClick={(e)=>handleEquipReport(e)} 
          disabled={!start || !end || working}
        >Generate Report</button>
      </div>
        
      {working ?
        <p>This may take a while...<n-fa0><i className='fas fa-spinner fa-lg fa-spin gapL'></i></n-fa0></p>
      :
        <span>
          <ReportStatsTable 
            title='Equipment Time Report' 
            dateString={`${start} to ${end}`}
            rows={eqData}
            extraClass='min600 max750 numFont overscroll'
          />
        
          <ReportStatsTable 
            title='Department Time report' 
            dateString={`${start} to ${end}`}
            rows={brData}
            extraClass='min600 max750 numFont overscroll' 
          />
        </span>
      }
          
    </div>
  );
};