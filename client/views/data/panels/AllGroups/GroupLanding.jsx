import React from 'react';
import Pref from '/client/global/pref.js';

import GroupForm from '/client/components/forms/GroupForm.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';


const GroupLanding = ({ 
  groupData, widgetData, 
  batchData, batchDataX, 
  app
})=> (
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
      </div>
    </div>
    
    
    <div className='centreRow'>
      
      <TrendLine 
        title={`new ${Pref.groups}`}
        statType='newGroup'
        cycleCount={12}
        cycleBracket='month'
        lineColor='rgb(52, 152, 219)' />
      
      <TrendLine 
        title={`new ${Pref.widgets}`}
        statType='newWidget'
        cycleCount={12}
        cycleBracket='month'
        lineColor='rgb(52, 152, 219)' />
        
      <TrendLine 
        title={`new ${Pref.version}s`}
        statType='newVersion'
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

export default GroupLanding;