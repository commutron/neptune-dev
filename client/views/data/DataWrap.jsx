import React from 'react';

import ActionBar from '../../components/bigUi/ActionBar.jsx';

const DataWrap = ({ batchData, widgetData, versionData, groupData, app, action })=> {
    
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
      
      <ActionBar
        batchData={batchData}
        itemData={itemData}
        widgetData={widgetData}
        versionData={versionData}
        groupData={groupData}
        app={app}
        action={action} />
            
    </div>
  );
};

export default DataWrap;