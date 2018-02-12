import React from 'react';

import DashActionBar from '../../components/bigUi/DashActionBar.jsx';
import FormBar from '../../components/bigUi/FormBar.jsx';

const Dashboard  = ({ 
  children,
  snap,
  batchData,
  itemData,
  widgetData,
  versionData,
  groupData,
  users,
  app,
  action
})=> {
    
  let scrollFix = {
    overflowY: 'auto'
  };
  let overScrollSpacer = {
    width: '100%',
    height: '60px'
  };
  
  return (
    <div className='dashMainSplit'>
      <div className='dashMainLeft' style={scrollFix}>
        {children[0]}
        <div style={overScrollSpacer}></div>
      </div>
      
      <div className='gridMainRight' style={scrollFix}>
        {children[1]}
        <div style={overScrollSpacer}></div>
      </div>
      
      {action === 'build' ?
        <FormBar
          batchData={batchData}
          itemData={itemData}
          widgetData={widgetData}
          versionData={versionData}
          users={users}
          app={app} />
        :
        <DashActionBar
          snap={snap}
          batchData={batchData}
          itemData={itemData}
          widgetData={widgetData}
          versionData={versionData}
          groupData={groupData}
          app={app}
          action={action} />
      }

    </div>
  );
};

export default Dashboard;