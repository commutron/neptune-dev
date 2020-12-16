import React from 'react';
import Pref from '/client/global/pref.js';

import Model from '/client/components/smallUi/Model.jsx';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import MultiItemForm from './MultiItemForm';
import YrWkPnItemForm from './YrWkPnItemForm';
import NSYrWkSqItemForm from './NSYrWkSqItemForm';

const ItemSerialsWrap = ({ id, items, more, unit, app })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'create');
  
  return(
    <Model
      button={'Add ' + Pref.item + 's'}
      title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
      color='greenT'
      icon={'fa-' + Pref.serialType}
      lock={!auth || !more}>
    

      <Tabs
        tabs={['Sequential', 'Year-Week-Panel', 'NorthStar Complex']}
        wide={true}
        hold={false}>
    
        <MultiItemForm
          id={id}
          items={items}
          unit={unit}
          app={app} />
          
        <YrWkPnItemForm
          id={id}
          items={items}
          unit={unit}
          app={app} />
          
        <NSYrWkSqItemForm
          id={id}
          items={items}
          unit={unit}
          app={app} />
        
      </Tabs>  
    </Model>     
  );
};

export default ItemSerialsWrap;