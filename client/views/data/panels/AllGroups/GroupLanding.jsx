import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import GroupForm from '/client/components/forms/GroupForm.jsx';
import NumBox from '/client/components/tinyUi/NumBox.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';

import { timeRanges } from '/client/utility/CycleCalc';

function countNewGroup(collected, rangeStart, rangeEnd) {
  const groupFind = collected.filter( x => 
    x.createdAt > new Date(rangeStart) &&
    x.createdAt < new Date(rangeEnd)
  );
  return groupFind.length;
}

function countNewWidget(collected, rangeStart, rangeEnd) {
  const widgetFind = collected.filter( x =>
    x.createdAt > new Date(rangeStart) &&
    x.createdAt < new Date(rangeEnd) 
  );
  return widgetFind.length;
}

function countNewVersion(collected, rangeStart, rangeEnd) {
  const widgetFind = collected.filter( x =>
    x.createdAt < new Date(rangeEnd) 
  );
    
  let vCount = 0;
  for(let wf of widgetFind) {
    const thisV = wf.versions.filter( x =>
      moment(x.createdAt).isBetween(rangeStart, rangeEnd)
    );
    vCount = vCount + thisV.length;   
  }
  return vCount;
}

const GroupLanding = ({ 
  groupData, widgetData, 
  batchData, batchDataX, 
  app
})=> {
  
  const verAdd = Array.from(widgetData, x => x.versions.length).reduce((x, y) => x + y, 0);

  const xyG = timeRanges(groupData, countNewGroup, 12, 'month');
  const xyW = timeRanges(widgetData, countNewWidget, 12, 'month');
  const xyV = timeRanges(widgetData, countNewVersion, 12, 'month');
  
  return(
    <div className='overscroll'>
      
      <div className='wide comfort'>
        <div className='centreRow'>
          
        </div>
        <div className='centreRow'>
          <GroupForm
            id={false}
            name={false}
            alias={false}
            wiki={false}
            noText={false}
            primeTopRight={true} />
          <NumBox
            num={groupData.length}
            name={Pref.group + 's'}
            color='blueT' />
          <NumBox
            num={widgetData.length}
            name={Pref.widget + 's'}
            color='blueT' />
          <NumBox
            num={verAdd}
            name={Pref.version + 's'}
            color='blueT' />
        </div>
      </div>
      
      
      <div className='centreRow'>
        
        <TrendLine 
          title={`new ${Pref.groups}`}
          localXY={xyG}
          //statType='newGroup'
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)' />
        
        <TrendLine 
          title={`new ${Pref.widgets}`}
          localXY={xyW}
          //statType='newWidget'
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)' />
          
        <TrendLine 
          title={`new ${Pref.version}s`}
          localXY={xyV}
          //statType='newVersion'
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
            
            
    </div>
  );
};

export default GroupLanding;