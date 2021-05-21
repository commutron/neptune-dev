import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import VariantCard from './VariantCard';

import WidgetEditForm from '/client/components/forms/WidgetEditForm';
import FlowFormHead from '/client/components/forms/FlowFormHead';
import VariantForm from '/client/components/forms/VariantForm';
import BatchXCreate from '/client/components/forms/Batch/BatchXCreate';

import Remove from '/client/components/forms/Remove';

import MultiBatchKPI from '/client/components/bigUi/MultiBatchKPI';

import FlowTable from '/client/components/tables/FlowTable';
import WTimeTab from './WTimeTab';
import NonConMultiBatchBar from '/client/components/charts/NonCon/NonConMultiBatchBar';

const WidgetPanel = ({ 
  groupData, widgetData, variantData,
  batchRelated, 
  app, user
})=> {

  const w = widgetData;
  const b = batchRelated;
  const a = app;
  
  const varS = variantData.sort((v1, v2)=> 
              v1.variant > v2.variant ? -1 : v1.variant < v2.variant ? 1 : 0 );
                               
  const bS = b.sort((b1, b2)=> b1.batch < b2.batch ? -1 : 
                               b1.batch > b2.batch ? 1 : 0 );
  const batchIDs = Array.from( bS, x => x._id );
  const batches = Array.from( bS, x => x.batch );

  return(
    <div className='space' key={w.widget}>
      <div className='split bspace'>
        
        <div className='wordBr vmarginhalf titleSection'>
          <span className='cap'>{w.describe}</span>
        </div>
        
        <div className='centreRow vwrap vmarginhalf'>
        
          <WidgetEditForm
            id={widgetData._id}
            now={widgetData}
            lockOut={groupData.hibernate} />
            
          <VariantForm
            widgetData={widgetData}
            variantData={false}
            app={app}
            rootWI={groupData.wiki}
            lockOut={groupData.hibernate} />
            
          <FlowFormHead
            id={widgetData._id}
            edit={false}
            existFlows={widgetData.flows}
            app={app} />
          
          {variantData && variantData.length > 0 ?
            <BatchXCreate
              groupId={groupData._id}
              widgetId={widgetData._id}
              versionKey={false}
              allVariants={variantData}
              lock={variantData.every(v => v.live === false) ? `No live ${Pref.variants}` : false}
            />
          : null}
          
          {batchRelated.length === 0 && 
          (!variantData || variantData.length === 0) ?  
            <Remove
              action='widget'
              title={widgetData.widget}
              check={widgetData.createdAt && widgetData.createdAt.toISOString()}
              entry={widgetData._id}
            />
          : null}
        </div>
        
      </div>
      
      <div>
          
      <Tabs
        tabs={[Pref.variants, Pref.flow + 's', 'Times', Pref.nonCon + 's']}
        wide={true}
        stick={false}
        hold={true}
        sessionTab='widgetExPanelTabs'>
        
        <div className='cardify autoFlex'>
            
          <MultiBatchKPI
            widgetId={widgetData._id}
            batchIDs={batchIDs}
            app={a} />
            
          {variantData.length < 1 ? <p>no {Pref.variants} created</p> : null}
          
          {varS.map( (ventry, index)=> {
            return(  
              <VariantCard
                key={ventry._id+index}
                variantData={ventry}
                widgetData={widgetData} 
                groupData={groupData}
                batchRelated={batchRelated.filter(b=> b.versionKey === ventry.versionKey)} 
                app={app}
                user={user}
              />
          )})}
  
        </div>
        
        <FlowTable id={w._id} flows={w.flows} app={a} />
        
        <WTimeTab
          widgetData={widgetData}
          batchIDs={batchIDs}
          app={a} />
          
        <NonConMultiBatchBar batches={batches} />
        
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