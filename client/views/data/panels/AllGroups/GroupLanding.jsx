import React, { useState, useEffect, Fragment } from 'react';
import Pref from '/public/pref.js';

import { MatchButton } from '/client/layouts/Models/Popover';
import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import TrendLine from '/client/components/charts/Trends/TrendLine';
import VariantNewList from '../../lists/VariantNewList';

import { timeRanges } from '/client/utility/CycleCalc';

const GroupLanding = ({ 
  groupData, widgetData, variantData, 
  openActions, canEdt 
})=> {
  
  return(
    <div className='overscroll'>
      
      <div className='wide rowWrapR gapsC'>

        <MatchButton 
          text={`new ${Pref.group}`}
          icon='fa-solid fa-industry'
          doFunc={()=>openActions('groupform', false)}
          lock={!canEdt}
        />
        
        <span className='flexSpace' />
        
        <KpiStat
          num={groupData.length}
          name={Pref.group + 's'}
          color='var(--peterriver)'
        />
        <KpiStat
          num={widgetData.length}
          name={Pref.widget + 's'}
          color='var(--peterriver)'
        />
        <KpiStat
          num={variantData.length}
          name={Pref.variants}
          color='var(--peterriver)'
        />

      </div>
      
      <RecentCharts />
      
      <div className='wide max875 vspacehalf'>
        <h3>New from the Last 7 Days</h3>
        
        <VariantNewList
          widgetData={widgetData}
          variantData={variantData}
          groupData={groupData}
          daysBack={7}
        />

      </div>
            
    </div>
  );
};

export default GroupLanding;

function countNewCollection(collected, rangeStart, rangeEnd) {
  const collectFind = collected.filter( x =>
    x > new Date(rangeStart) &&
    x < new Date(rangeEnd) 
  );
  return collectFind.length;
}

const RecentCharts = ()=> {
  
  const [ charts, chartsSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('groupRecentCreated' , (err, re)=> {
      err && console.log(err);
      if(re) {
        chartsSet(re);
      }
    });
  },[]);
  
  const xyG = charts ? timeRanges(charts[0], countNewCollection, 12, 'month') : [];
  const xyW = charts ? timeRanges(charts[1], countNewCollection, 12, 'month') : [];
  const xyV = charts ? timeRanges(charts[2], countNewCollection, 12, 'month') : [];
  
  return(
    <Fragment>
      
      <div className='centreRow'>
        
        <TrendLine 
          title={`new ${Pref.groups}`}
          localXY={xyG}
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)' />
        
        <TrendLine 
          title={`new ${Pref.widgets}`}
          localXY={xyW}
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)' />
          
        <TrendLine 
          title={`new ${Pref.variants}`}
          localXY={xyV}
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)' />
       
      </div>
      
      <details className='footnotes'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          Trends include {12} months, including the current month. 
          Read left to right as past to current.
        </p>
      </details>
    </Fragment>
  );
};