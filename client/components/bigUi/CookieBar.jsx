import { Meteor } from 'meteor/meteor';
import React from 'react';

const CookieBar = ({ groupData, widgetData, versionData, batchData, itemData, action }) => {

              
            
  return(
    <div className=''>
      {groupData && <i>{groupData.alias}</i>}
      {widgetData && <i>{widgetData.widget}</i>}
      {versionData && <i>v.{versionData.version}</i>}
      {batchData && <i>{batchData.batch}</i>}
      {itemData && <i>{itemData.serial}</i>}
    </div>
  );
};

export default CookieBar;