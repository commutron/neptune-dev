import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

import Tabs from '/client/components/smallUi/Tabs/Tabs';

import YMDItemForm from './YMDItemForm';
import YrWkPnItemFormX from './YrWkPnItemFormX';
import NSYrWkSqItemFormX from './NSYrWkSqItemFormX';

const ItemSerialsWrapX = ({ 
  bID, quantity, seriesId, itemsQ, unit, app, isDebug, access
})=> {
  
  const quantityCheck = (tryLength, quantity, start, stop)=>
    tryLength > 0 && tryLength <= Pref.seriesLimit && tryLength <= quantity ? 
    false : 
    `${start} to ${stop} > ${Pref.xBatch} quantity`;
  
  function showToast() {
    toast.warn('Please Wait For Confirmation...', {
      toastId: ( bID + 'itemcreate' ),
      autoClose: false
    });
  }
  function updateToast(rtn) {
    const error = (err)=> {
      toast.update(( bID + 'itemcreate' ), {
        render: err,
        type: toast.TYPE.ERROR,
        autoClose: false
      });
    };
    if(rtn === 'bad_range') {
      error('Invalid Serials. Range Exceeds Quantity');
    }else if(rtn === 'no_series') {
      error('Series Not Available');
    }else if(rtn === 'no_range') {
      error('Invalid Serial Format');
    }else if(rtn === 'no_access') {
      error("No 'Create' Permission");
    }else if(rtn.success === true) {
      toast.update(( bID + 'itemcreate' ), {
        render: "Serials Created Successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000
      });
    }else{
      error("Unknown Server Error");
    }
  }
  
  if(!access) {
    return null;
  }
  
  return(
    <ModelNative
      dialogId={bID+'_items_form'}
      title={`Add ${Pref.item} ${Pref.itemSerial} numbers`}
      icon='fa-solid fa-barcode'
      colorT='blueT'>
      
    {itemsQ >= quantity ?
      <NoBox />
      :
      <ItemSerialsTabs
        bID={bID}
        seriesId={seriesId}
        unit={unit}
        quantity={quantity}
        app={app}
        isDebug={isDebug}
        quantityCheck={quantityCheck}
        showToast={showToast}
        updateToast={updateToast}
      />
    }
    </ModelNative>
  );
};

export default ItemSerialsWrapX;

const ItemSerialsTabs = ({ 
  bID, seriesId, unit, quantity,
  app, isDebug, quantityCheck, showToast, updateToast
})=> (
  <Tabs
    tabs={['Year-Month-Day', 'Year-Week-Panel', 'NorthStar Complex']}
    wide={true}
    hold={false}>
    
    <YMDItemForm
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      quantity={quantity}
      app={app}
      isDebug={isDebug}
      quantityCheck={quantityCheck}
      showToast={showToast}
      updateToast={updateToast} />
      
    <YrWkPnItemFormX
      bID={bID}
      seriesId={seriesId}
      quantity={quantity}
      app={app}
      isDebug={isDebug}
      quantityCheck={quantityCheck}
      showToast={showToast}
      updateToast={updateToast} />
      
    <NSYrWkSqItemFormX
      bID={bID}
      seriesId={seriesId}
      quantity={quantity}
      app={app}
      isDebug={isDebug}
      quantityCheck={quantityCheck}
      showToast={showToast}
      updateToast={updateToast} />
    
  </Tabs>  
);

const NoBox = ()=> (
  <div className='centreText vmargin space2vsq'>
    <h2>No More Items</h2>
    <h3>Number of serialized items equals the order quantity.
    <br />To create more items, first increase the order quantity.</h3>
  </div>
);