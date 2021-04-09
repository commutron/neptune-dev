import React from 'react';
import Pref from '/client/global/pref.js';

import ModelLarge from '/client/components/smallUi/ModelLarge.jsx';

import MultiItemForm from './MultiItemForm';

const ItemSerialsWrap = ({ id, items, more, unit, app })=> {
  
  const auth = Roles.userIsInRole(Meteor.userId(), 'create');
  
  return(
    <ModelLarge
      button={'Add ' + Pref.item + 's'}
      title={'add ' + Pref.item + ' ' + Pref.itemSerial + ' numbers'}
      color='greenT'
      icon={'fa-' + Pref.serialType}
      lock={!auth || !more}>
    
        <MultiItemForm
          id={id}
          items={items}
          unit={unit}
          app={app} />
        
    </ModelLarge>     
  );
};

export default ItemSerialsWrap;