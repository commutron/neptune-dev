import React from 'react';
import Pref from '/client/global/pref.js';

import ModelLarge from '/client/components/smallUi/ModelLarge';
import ModelSmall from '/client/components/smallUi/ModelSmall';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import MultiItemFormX from './MultiItemFormX';
import YrWkPnItemFormX from './YrWkPnItemFormX';
import NSYrWkSqItemFormX from './NSYrWkSqItemFormX';

const ItemSerialsWrapX = ({ bID, quantity, seriesId, itemsQ, unit, app, lock })=> {
  if(quantity === itemsQ) {
    return(
      <ModelSmall
        button={'Add ' + Pref.item + 's'}
        title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
        color='greenT'
        icon={'fa-' + Pref.serialType}
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
      lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}
    >
      <ItemSerialsTabs
        bID={bID}
        seriesId={seriesId}
        unit={unit}
        app={app} 
      />
    </ModelLarge>
  );
};

export default ItemSerialsWrapX;

const ItemSerialsTabs = ({ bID, seriesId, unit, app })=> (
  <Tabs
    tabs={['Sequential', 'Year-Week-Panel', 'NorthStar Complex']}
    wide={true}
    hold={false}>

    <MultiItemFormX
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app} />
      
    <YrWkPnItemFormX
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app} />
      
    <NSYrWkSqItemFormX
      bID={bID}
      seriesId={seriesId}
      unit={unit}
      app={app} />
    
  </Tabs>  
);

const NoBox = ()=> (
  <div className='centreText vmargin space2vsq'>
    <h2>No More Items</h2>
    <h4>Number of serialized items equals the order quantity.
    <br />To create more items, first increase the order quantity</h4>
  </div>
);