import React from 'react';

import FormBar from '../../components/bigUi/FormBar.jsx';

// depreciated

const ProductionWrap  = ({ 
  children,
  batchData,
  itemData,
  widgetData,
  versionData,
  users,
  app,
  actionBar
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
      
      {!actionBar ||
        <FormBar
          batchData={batchData}
          itemData={itemData}
          widgetData={widgetData}
          versionData={versionData}
          users={users}
          app={app} />
      }

    </div>
  );
};

export default ProductionWrap;
