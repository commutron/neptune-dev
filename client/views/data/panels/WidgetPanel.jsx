import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import VariantList from '../lists/VariantList.jsx';

import MultiBatchKPI from '/client/components/bigUi/MultiBatchKPI';

import FlowTable from '/client/components/tables/FlowTable.jsx';
import TideMultiBatchBar from '/client/components/charts/Tides/TideMultiBatchBar.jsx';
import NonConMultiBatchBar from '/client/components/charts/NonCon/NonConMultiBatchBar.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

import { min2hr, flipArray } from '/client/utility/Convert';

const WidgetPanel = ({ 
  groupData, widgetData, variantData,
  batchRelated, 
  app, user
})=> {

  // const g = groupData;
  const w = widgetData;
  const b = batchRelated;
  const a = app;
  
  const batchIDs = flipArray( Array.from( b, x => x._id ) );

  return(
    <div className='space' key={w.widget}>
    
      <div className='titleSection'>
        <span className='cap'>{w.describe}</span>
        {/*
        <span>
          <WatchButton 
            list={user.watchlist}
            type='widget'
            keyword={w.widget} />
        </span>
        */}
      </div>
      
      <div className='edit'>
        
      <br />
          
      <Tabs
        tabs={[Pref.variants, Pref.flow + 's', 'Times', Pref.nonCon + 's']}
        wide={true}
        stick={false}
        hold={true}
        sessionTab='widgetExPanelTabs'>
        
        <div className='comfort'>
          <MultiBatchKPI
            batchIDs={batchIDs}
            app={a} />
          <VariantList 
            variantData={variantData}
            widgetData={w} 
            app={a} />
        </div>
        
        <FlowTable id={w._id} flows={w.flows} app={a} />
        
        <TideMultiBatchBar 
          // batchRelated={batchRelated}
          batchIDs={batchIDs}
          app={a} />
        
        <NonConMultiBatchBar batchIDs={batchIDs} />
        
      </Tabs>

      </div>

      <CreateTag
        when={w.createdAt}
        who={w.createdWho}
        whenNew={w.updatedAt}
        whoNew={w.updatedWho}
        dbKey={w._id} />
    </div>
  );
};

export default WidgetPanel;