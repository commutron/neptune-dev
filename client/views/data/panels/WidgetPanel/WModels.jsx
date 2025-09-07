import React, { Fragment } from 'react';

import { WidgetEdit } from '/client/components/forms/WidgetForm';
import FlowFormHead from '/client/components/forms/Flow/FlowFormHead';
import FlowFormRoute from '/client/components/forms/Flow/FlowFormRoute';
import QuoteTaskTime from '/client/components/forms/Flow/QuoteTaskTime';
import VariantForm from '/client/components/forms/VariantForm';
import BatchCreate from '/client/components/forms/Batch/Parent/BatchCreate';
import Remove from '/client/components/forms/Remove';

const WModels = ({ 
  widgetData, groupData, variantData, users, app,
  selectedFlow, bload, imods, clearOnClose, unloadOnClose,
  doVar, canEdt, canSls, doBch, doRmv, isDebug
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
        access={doVar} 
      />
      <FlowFormHead
        id={widgetData._id}
        preFillKey={selectedFlow}
        existFlows={widgetData.flows}
        app={app}
        access={canEdt}
        clearOnClose={clearOnClose}
      />
      <FlowFormRoute
        id={widgetData._id}
        preFillKey={selectedFlow}
        existFlows={widgetData.flows}
        imods={imods}
        app={app}
        access={canEdt}
        clearOnClose={clearOnClose}
      />
      <QuoteTaskTime
        id={widgetData._id}
        flowKey={selectedFlow}
        existFlows={widgetData.flows}
        app={app}
        access={canSls}
        isDebug={isDebug}
        clearOnClose={clearOnClose}
      />
      <BatchCreate
        groupId={groupData._id}
        gemail={groupData.emailOptIn}
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