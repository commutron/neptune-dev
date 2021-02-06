import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge';
import ModelSmall from '/client/components/smallUi/ModelSmall';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import MultiItemFormX from './MultiItemFormX';
import YrWkPnItemFormX from './YrWkPnItemFormX';
import NSYrWkSqItemFormX from './NSYrWkSqItemFormX';

const ItemSerialsWrapX = ({ 
  bID, quantity, seriesId, itemsQ, unit, app, lock, lgIcon
})=> {
  
  function showToast() {
    toast.warn('Please Wait For Confirmation...', {
      toastId: ( bID + 'itemcreate' ),
      autoClose: false
    });
  }
  function updateToast() {
    toast.update(( bID + 'itemcreate' ), {
      render: "Serials Created Successfully",
      type: toast.TYPE.SUCCESS,
      autoClose: 3000
    });
  }
  if(quantity === itemsQ) {
    updateToast();
    return(
      <ModelSmall
        button={'Add ' + Pref.item + 's'}
        title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
        color='greenT'
        icon={'fa-' + Pref.serialType}
        lgIcon={lgIcon}
        lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}
      >
        <NoBox />
      </ModelSmall>
    );
  }

  return(
    <ModelLarge
      button={'Add ' + Pref.item + 's'}
      title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
      color='greenT'
      icon={'fa-' + Pref.serialType}
      lgIcon={lgIcon}
      lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}
    >
      <ItemSerialsTabs
        bID={bID}
        seriesId={seriesId}
        unit={unit}
        app={app}
        showToast={showToast}
        updateToast={updateToast}
      />
    </ModelLarge>
  );
};

export default ItemSerialsWrapX;

const ItemSerialsTabs = ({ bID, seriesId, unit, app, showToast, updateToast })=> (
  <Tabs
    tabs={['Sequential', 'Year-Week-Panel', 'NorthStar Complex']}
    wide={true}
    hold={false}>

    <MultiItemFormX
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app}
      showToast={showToast}
      updateToast={updateToast} />
      
    <YrWkPnItemFormX
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app}
      showToast={showToast}
      updateToast={updateToast} />
      
    <NSYrWkSqItemFormX
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app}
      showToast={showToast}
      updateToast={updateToast} />
    
  </Tabs>  
);

const NoBox = ()=> (
  <div className='centreText vmargin space2vsq'>
    <h2>No More Items</h2>
    <h4>Number of serialized items equals the order quantity.
    <br />To create more items, first increase the order quantity</h4>
  </div>
);