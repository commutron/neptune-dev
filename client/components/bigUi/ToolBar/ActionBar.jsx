import React, { Fragment } from 'react';

import './style.css';

import ActionLink from '/client/components/tinyUi/ActionLink.jsx';

import BatchXEdit from '/client/components/forms/Batch/BatchXEdit';
import BatchXIncomplete from '/client/components/forms/Batch/BatchXIncomplete';
import RemoveXBatch from '/client/components/forms/Batch/RemoveXBatch';

import SeriesForm from '/client/components/forms/ItemSerialsX/SeriesForm';
import ItemSerialsWrapX from '/client/components/forms/ItemSerialsX/ItemSerialsWrapX';

import UnitSetX from '/client/components/forms/ItemSerialsX/UnitSetX';
import PanelBreakX from '/client/components/forms/ItemSerialsX/PanelBreakX';
import UndoFinishX from '/client/components/forms/ItemSerialsX/UndoFinishX';
import ItemIncompleteX from '/client/components/forms/ItemSerialsX/ItemIncompleteX';
import ScrapItemX from '/client/components/forms/ItemSerialsX/ScrapItemX';
import RemoveItem from '/client/components/forms/ItemSerialsX/RemoveItem';

import CounterAssign from '/client/components/bigUi/ArrayBuilder/CounterAssign.jsx';

const ActionBar = ({
  batchData, seriesData, rapidData, itemData, 
  groupData, widgetData, 
  variantData, allVariants,
  app, user,
  action, noText,
  ncTypesCombo
})=> (
  
  <Fragment>
    { 
  	action === 'xitem' ?
  	  <Fragment> 
    	  <UnitSetX
    	    seriesId={seriesData._id}
    	    item={itemData} />
    	  <PanelBreakX
          batchId={batchData._id}
          seriesId={seriesData._id}
          batchNum={batchData.batch}
    	    item={itemData} />
        <UndoFinishX
    	    batchId={batchData._id}
    	    finishedAtB={batchData.completedAt}
    	    seriesId={seriesData._id}
    	    serial={itemData.serial}
    	    finishedAtI={itemData.completedAt}
    	    rapidData={rapidData}
    	    rapids={itemData.altPath.filter(x=> x.rapId !== false)} />
        <ItemIncompleteX
          seriesId={seriesData._id}
          item={itemData}
          app={app} />
        <ScrapItemX
          seriesId={seriesData._id}
          item={itemData}
          ancillary={app.ancillaryOption} />
        <RemoveItem
          batchId={batchData._id}
          batch={batchData.batch}
          seriesId={seriesData._id}
          serial={itemData.serial}
          check={itemData.createdAt.toISOString()}
          lockOut={batchData.completed || itemData.completed} />
      </Fragment>
		:
      action === 'xbatch' ?
        <Fragment>
          <BatchXEdit
            batchData={batchData}
            seriesData={seriesData}
            allVariants={allVariants}
            lock={!variantData || !batchData.live || batchData.completed}
          />
          
          <SeriesForm
            batchData={batchData}
            lock={!batchData.live || seriesData || batchData.completed}
          />
        
          <ItemSerialsWrapX
            bID={batchData._id}
            quantity={batchData.quantity}
            seriesId={seriesData._id}
            itemsQ={!seriesData ? 0 : seriesData.items.length}
            unit={variantData.runUnits}
            app={app}
            lock={!batchData.live || !seriesData || batchData.completed} />
          
          <CounterAssign
            id={batchData._id}
            waterfall={batchData.waterfall}
            app={app}
            lock={!batchData.live || batchData.completed} />
          
          <span>
            <ActionLink
              address={'/print/generallabel/' + 
                        batchData.batch + 
                        '?group=' + groupData.alias +
                        '&widget=' + widgetData.widget + 
                        '&ver=' + variantData.variant +
                        '&desc=' + widgetData.describe +
                        '&sales=' + (batchData.salesOrder || '') +
                        '&quant=' + batchData.quantity }
              title='Print Label'
              icon='fas fa-print'
              color='blackT' />
          </span>
          
          <BatchXIncomplete
            batchData={batchData}
            seriesData={seriesData}
            app={app}
            lockOut={!batchData.live || batchData.completed} />
          
          <RemoveXBatch
            batchData={batchData}
            seriesData={seriesData}
            check={batchData.createdAt.toISOString()}
            lockOut={!batchData.live || batchData.completed} />
          
        </Fragment>
      : null
    }
  </Fragment>
);

export default ActionBar;