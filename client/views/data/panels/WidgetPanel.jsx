import React from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import VersionList from '../lists/VersionList.jsx';
import FlowTable from '../../../components/tables/FlowTable.jsx';
import TideMultiBatchBar from '../../../components/charts/TideMultiBatchBar.jsx';
import NonConMultiBatchBar from '../../../components/charts/NonConMultiBatchBar.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const WidgetPanel = ({ groupData, widgetData, batchRelated, app, user })=> {

  const g = groupData;
  const w = widgetData;
  const b = batchRelated;
  const a = app;

  return (
    <AnimateWrap type='cardTrans'>
      <div className='section' key={w.widget}>
      
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
        
        <div className='space edit'>
          
        <br />
            
        <Tabs
          tabs={[Pref.version + 's', Pref.flow + 's', 'Times', Pref.nonCon + 's']}
          wide={true}
          stick={false}
          hold={true}
          sessionTab='widgetExPanelTabs'>
          
          <VersionList 
            versionData={w.versions}
            widgetData={w} 
            app={a} />
          
          <FlowTable id={w._id} flows={w.flows} app={a} />
          
          <TideMultiBatchBar 
            batchRelated={batchRelated}
            batchIDs={Array.from( b, x => x._id )}
            app={a} />
          
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