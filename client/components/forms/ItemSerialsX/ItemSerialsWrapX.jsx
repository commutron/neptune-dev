import React from 'react';
import Pref from '/client/global/pref.js';

import ModelLarge from '/client/components/smallUi/ModelLarge.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import MultiItemFormX from './MultiItemFormX';
import YrWkPnItemFormX from './YrWkPnItemFormX';
import NSYrWkSqItemFormX from './NSYrWkSqItemFormX';

const ItemSerialsWrapX = ({ bID, seriesId, items, more, unit, app })=> (
  <ModelLarge
    button={'Add ' + Pref.item + 's'}
    title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
    color='greenT'
    icon={'fa-' + Pref.serialType}
    lock={!Roles.userIsInRole(Meteor.userId(), 'create') || !more}
  >
    <ItemSerialsTabs
      bID={bID}
      seriesId={seriesId}
      items={items}
      unit={unit}
      app={app} 
    />
  </ModelLarge>
);

export default ItemSerialsWrapX;

const ItemSerialsTabs = ({ bID, seriesId, items, unit, app })=> (
  <Tabs
    tabs={['Sequential', 'Year-Week-Panel', 'NorthStar Complex']}
    wide={true}
    hold={false}>

    <MultiItemFormX
      bID={bID}
      seriesId={seriesId}
      items={items}
      unit={unit}
      app={app} />
      
    <YrWkPnItemFormX
      bID={bID}
      seriesId={seriesId}
      items={items}
      unit={unit}
      app={app} />
      
    <NSYrWkSqItemFormX
      bID={bID}
      seriesId={seriesId}
      items={items}
      unit={unit}
      app={app} />
    
  </Tabs>  
);