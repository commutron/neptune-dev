import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/layouts/Models/ModelLarge';
import ModelSmall from '/client/components/smallUi/ModelSmall';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import YMDItemForm from './YMDItemForm';
import YrWkPnItemFormX from './YrWkPnItemFormX';
import NSYrWkSqItemFormX from './NSYrWkSqItemFormX';

const ItemSerialsWrapX = ({ 
  bID, quantity, seriesId, itemsQ, unit, app, lock, lgIcon
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
  
  const access = Roles.userIsInRole(Meteor.userId(), 'create');
  const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
  const aT = !access ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = access && !lock ? `Add ${Pref.item} ${Pref.itemSerial} numbers` : `${aT}\n${lT}`;

  if(itemsQ >= quantity) {
    return(
      <ModelSmall
        button={'Add ' + Pref.item + 's'}
        title={title}
        color='blueT'
        icon={'fa-' + Pref.serialIcon}
        lgIcon={lgIcon}
        lock={!access || lock}
      >
        <NoBox />
      </ModelSmall>
    );
  }
  
  return(
    <ModelLarge
      button={'Add ' + Pref.item + 's'}
      title={title}
      color='blueT'
      icon={'fa-' + Pref.serialIcon}
      lgIcon={lgIcon}
      lock={!access || lock}
    >
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
    </ModelLarge>
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