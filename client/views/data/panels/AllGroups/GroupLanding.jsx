import React from 'react';
import Pref from '/client/global/pref.js';

import GroupForm from '/client/components/forms/GroupForm.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';

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
    
    
    <div className=''>
      
      
     
    </div>
  </div>
);

export default GroupLanding;