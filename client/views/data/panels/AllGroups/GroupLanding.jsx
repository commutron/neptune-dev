import React from 'react';
import Pref from '/client/global/pref.js';

import { MatchButton } from '/client/layouts/Models/Popover';
import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';
import TrendLine from '/client/components/charts/Trends/TrendLine';
import VariantNewList from '../../lists/VariantNewList';

import { timeRanges } from '/client/utility/CycleCalc';

function countNewCollection(collected, rangeStart, rangeEnd) {
  const collectFind = collected.filter( x =>
    x.createdAt > new Date(rangeStart) &&
    x.createdAt < new Date(rangeEnd) 
  );
  return collectFind.length;
}

const GroupLanding = ({ groupData, widgetData, variantData, openActions, canEdt })=> {
  
  const og = groupData.find( x => x.internal );
  const ogID = og ? og._id : 'none';
  const g = groupData.filter( x => x._id !== ogID );
  const xyG = timeRanges(g, countNewCollection, 12, 'month');
  const w = widgetData.filter( x => x.groupId !== ogID );
  const xyW = timeRanges(w, countNewCollection, 12, 'month');
  const v = variantData.filter( x => x.groupId !== ogID );
  const xyV = timeRanges(v, countNewCollection, 12, 'month');
  
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
          num={groupData.length + 34}
          name={Pref.group + 's'}
          color='var(--peterriver)'
        />
        <KpiStat
          num={widgetData.length + 378}
          name={Pref.widget + 's'}
          color='var(--peterriver)'
        />
        <KpiStat
          num={variantData.length + 23}
          name={Pref.variants}
          color='var(--peterriver)'
        />

      </div>
      
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