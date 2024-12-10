import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import Tabs from '/client/components/smallUi/Tabs/Tabs';
import { PopoverButton, PopoverMenu, PopoverAction, MatchButton } from '/client/layouts/Models/Popover';

import VariantCard from './VariantCard';

import { WidgetEdit } from '/client/components/forms/WidgetForm';
import FlowFormHead from '/client/components/forms/FlowFormHead';
import FlowFormRoute from '/client/components/forms/FlowFormRoute';
import VariantForm from '/client/components/forms/VariantForm';
import BatchCreate from '/client/components/forms/Batch/Parent/BatchCreate';

import Remove from '/client/components/forms/Remove';

import MultiBatchKPI from '/client/components/bigUi/MultiBatchKPI';

import FlowTable from '/client/components/tables/FlowTable';
import WTimeTab from './WTimeTab';
import WProbTab from './WProbTab';


const WidgetPanel = ({ 
  groupData, widgetData, variantData,
  batchRelated,
  app, user, users
})=> {

  const [ selectedFlow, selectedFlowSet ] = useState(false);
  const [ bload, bloadSet ] = useState(false);
  
  const w = widgetData;
  const v = variantData;
  const b = batchRelated;
  const a = app;
  
  const openActions = (model, select)=> {
    selectedFlowSet(select);
    if(model === 'topflow') {
      const dialog = document.getElementById(w._id+'_flowhead_form');
      dialog?.showModal();
    }else if(model === 'proflow') {
      const dialog = document.getElementById(w._id+'_flowroute_form');
      dialog?.showModal();
    }
  };
  
  const openDirect = (dialogId)=> {
    const dialog = document.getElementById(dialogId);
    dialog?.showModal();
  };
  
  const varS = variantData.sort((v1, v2)=> 
              v1.variant > v2.variant ? -1 : v1.variant < v2.variant ? 1 : 0 );
                               
  const bS = b.sort((b1, b2)=> b1.batch < b2.batch ? -1 : b1.batch > b2.batch ? 1 : 0 );
  const batchIDs = Array.from( bS, x => x._id );
  const batches = Array.from( bS, x => x.batch );
  
  const canEdt = Roles.userIsInRole(Meteor.userId(), 'edit');
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const canCrt = Roles.userIsInRole(Meteor.userId(), 'create');
  const canRmv = Roles.userIsInRole(Meteor.userId(), 'remove');
  const doEdt = canEdt && !groupData.hibernate;
  const doVar = (canCrt || canEdt) && !groupData.hibernate;
  const doBch = canCrt && v && v.length > 0 && v.some(v => v.live === true);
  const doRmv = b.length === 0 && (!v || v.length === 0) && canRmv;

  return(
    <div className='space' key={w.widget}>
      <WidgetEdit
        id={widgetData._id}
        now={widgetData}
      />
      <VariantForm
        widgetData={widgetData}
        users={users}
        app={app}
        rootWI={groupData.wiki}
        access={doVar} 
      />
      <FlowFormHead
        id={w._id}
        preFill={selectedFlow}
        existFlows={w.flows}
        app={app}
        access={canEdt}
        clearOnClose={()=>selectedFlowSet(false)}
      />
      <FlowFormRoute
        id={w._id}
        preFill={selectedFlow}
        existFlows={w.flows}
        app={app}
        access={canEdt}
        clearOnClose={()=>selectedFlowSet(false)}
      />
      <BatchCreate
        groupId={groupData._id}
        widgetId={widgetData._id}
        allVariants={variantData}
        access={doBch}
        prerun={bload}
        clearOnClose={()=>bloadSet(false)}
      />
      <Remove
        action='widget'
        title={widgetData.widget}
        check={widgetData.createdAt && widgetData.createdAt.toISOString()}
        entry={widgetData._id}
        access={doRmv}
      />
      
      <div className='floattaskbar stick light'>
        <PopoverButton 
          targetid='editspop'
          attach='edits'
          text='Edits'
          icon='fa-solid fa-file-pen gapR'
        />
        <PopoverMenu targetid='editspop' attach='edits'>
          <PopoverAction 
            doFunc={()=>openDirect(w._id+'_widget_edit_form')}
            text={`Edit ${Pref.widget}`}
            icon='fa-solid fa-cube'
            lock={!doEdt}
          />
          <PopoverAction 
            doFunc={()=>openDirect(w._id+'_newvar_form')}
            text={`New ${Pref.variant}`}
            icon='fa-solid fa-cube fa-rotate-90'
            lock={!doVar}
          />
          <PopoverAction 
            doFunc={()=>openActions('topflow', null)}
            text='New Flow'
            icon='fa-solid fa-project-diagram'
            lock={!canEdt}
          />
          <PopoverAction 
            doFunc={()=>openDirect('widget_multi_delete_form')}
            text={`Delete ${Pref.widget}`}
            icon='fa-solid fa-minus-circle'
            lock={!doRmv}
          />
        </PopoverMenu>
        
        <MatchButton 
          text={`New ${Pref.xBatch}`}
          icon='fa-solid fa-cubes'
          doFunc={()=>{bloadSet(true);openDirect(w._id+'_batch_new_form')}}
          lock={!doBch}
        />
        
        <span className='flexSpace' />
        
        <span className='cap wordBr'><strong>{w.describe}</strong></span>
        
      </div>
      
      <div>
          
      <Tabs
        tabs={[Pref.variants, Pref.flow + 's', 'Times', 'Problems']}
        wide={true}
        stick={false}
        hold={true}
        sessionTab='widgetExPanelTabs'>
        
        <div className='cardify autoFlex'>
            
          <MultiBatchKPI
            widgetId={widgetData._id}
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
                canRun={canRun}
                canRmv={canRmv}
              />
          )})}
  
        </div>
        
        <FlowTable 
          id={w._id}
          flows={w.flows}
          app={a}
          openActions={openActions}
        />
        
        <WTimeTab
          widgetData={widgetData}
          batchIDs={batchIDs}
          app={a} />
          
        <WProbTab
          widgetData={widgetData}
          app={a}
          batches={batches} />
        
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