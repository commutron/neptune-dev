import React from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '/client/components/smallUi/Tabs.jsx';

import FlowTable from '../../../components/tables/FlowTable.jsx';
import VersionTable from '../../../components/tables/VersionTable.jsx';
import NonConMultiBatchBar from '../../../components/charts/NonConMultiBatchBar.jsx';

const WidgetPanel = ({ groupData, widgetData, batchRelated, app })=> {

  const g = groupData;
  const w = widgetData;
  const b = batchRelated;
  const a = app;

  return (
    <AnimateWrap type='cardTrans'>
      <div className='section' key={w.widget}>
      
        <div className='titleSection'>
          <span className='cap'>{w.describe}</span>
        </div>
        
        <div className='space edit'>
          
        <br />
            
        <Tabs
          tabs={[Pref.version + 's', Pref.flow + 's', Pref.nonCon + 's']}
          wide={true}
          stick={false}
          hold={true}
          sessionTab='widgetExPanelTabs'>
          
          <VersionTable widgetData={w} app={a} />
          
          <FlowTable id={w._id} flows={w.flows} app={a} />
          
          <NonConMultiBatchBar batchIDs={Array.from( b, x => x._id )} />
          
        </Tabs>
  
        </div>

        <CreateTag
          when={w.createdAt}
          who={w.createdWho}
          whenNew={w.updatedAt}
          whoNew={w.updatedWho}
          dbKey={w._id} />
      </div>
    </AnimateWrap>
  );
};

export default WidgetPanel;