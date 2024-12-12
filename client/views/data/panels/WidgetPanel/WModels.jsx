import React, { Fragment } from 'react';

import { WidgetEdit } from '/client/components/forms/WidgetForm';
import FlowFormHead from '/client/components/forms/FlowFormHead';
import FlowFormRoute from '/client/components/forms/FlowFormRoute';
import VariantForm from '/client/components/forms/VariantForm';
import BatchCreate from '/client/components/forms/Batch/Parent/BatchCreate';
import Remove from '/client/components/forms/Remove';

const WModels = ({ 
  widgetData, groupData, variantData, users, app,
  selectedFlow, bload, clearOnClose, unloadOnClose,
  doVar, canEdt, doBch, doRmv
})=> {
  return(
  	<Fragment>
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
        id={widgetData._id}
        preFill={selectedFlow}
        existFlows={widgetData.flows}
        app={app}
        access={canEdt}
        clearOnClose={clearOnClose}
      />
      <FlowFormRoute
        id={widgetData._id}
        preFill={selectedFlow}
        existFlows={widgetData.flows}
        app={app}
        access={canEdt}
        clearOnClose={clearOnClose}
      />
      <BatchCreate
        groupId={groupData._id}
        widgetId={widgetData._id}
        allVariants={variantData}
        access={doBch}
        prerun={bload}
        clearOnClose={unloadOnClose}
      />
      <Remove
        action='widget'
        title={widgetData.widget}
        check={widgetData.createdAt && widgetData.createdAt.toISOString()}
        entry={widgetData._id}
        access={doRmv}
      />
  	</Fragment>
  );
};

export default WModels;