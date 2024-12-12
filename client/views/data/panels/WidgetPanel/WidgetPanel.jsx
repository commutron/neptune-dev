import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import Tabs from '/client/components/smallUi/Tabs/Tabs';
import { PopoverButton, PopoverMenu, PopoverAction, MatchButton } from '/client/layouts/Models/Popover';

import VariantCards from './VariantCards';
import WModels from './WModels';
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
      
      <WModels
        widgetData={widgetData}
        groupData={groupData}
        variantData={variantData}
        users={users}
        app={app}
        selectedFlow={selectedFlow}
        bload={bload}
        clearOnClose={()=>selectedFlowSet(false)}
        unloadOnClose={()=>bloadSet(false)}
        doVar={doVar} 
        canEdt={canEdt}
        doBch={doBch}
        doRmv={doRmv}
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
        
        <div className='space'>
          {variantData.length < 1 ? <p>no {Pref.variants} created</p> : 
            <VariantCards
              variantData={variantData}
              widgetData={widgetData} 
              groupData={groupData}
              batchRelated={batchRelated}
              app={app}
              user={user}
              canEdt={canEdt}
              canRun={canRun}
              canRmv={canRmv}
              modelFunc={openDirect}
            />
          }
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