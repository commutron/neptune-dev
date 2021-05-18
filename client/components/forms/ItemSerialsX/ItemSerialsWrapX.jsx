import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge';
import ModelSmall from '/client/components/smallUi/ModelSmall';
import Tabs from '/client/components/smallUi/Tabs/Tabs.jsx';

import YMDItemForm from './YMDItemForm';
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
  
  const access = Roles.userIsInRole(Meteor.userId(), 'create');
  const aT = !access ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = access && !lock ? `Add ${Pref.item} ${Pref.itemSerial} numbers` : `${aT}\n${lT}`;

  if(itemsQ >= quantity) {
    updateToast();
    return(
      <ModelSmall
        button={'Add ' + Pref.item + 's'}
        title={title}
        color='greenT'
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
      color='greenT'
      icon={'fa-' + Pref.serialIcon}
      lgIcon={lgIcon}
      lock={!access || lock}
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
    tabs={['Year-Month-Day', 'Year-Week-Panel', 'NorthStar Complex']}
    wide={true}
    hold={false}>
    
    <YMDItemForm
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app}
      showToast={showToast}
      updateToast={updateToast} />
      
    <YrWkPnItemFormX
      bID={bID}
      seriesId={seriesId}
      app={app}
      showToast={showToast}
      updateToast={updateToast} />
      
    <NSYrWkSqItemFormX
      bID={bID}
      seriesId={seriesId}
      app={app}
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