import { Meteor } from 'meteor/meteor';
import React from 'react';
//import ActionBar from '/client/components/bigUi/ActionBar.jsx';

const CookieBar = ({ groupData, widgetData, versionData, batchData, itemData, app, action, miniAction }) => {
  
  return(
    <div className='cookieRow'>
      {groupData && 
        <span className='cookieCrumb'>
          <button 
            className='cookie up numFont'
            onClick={()=>FlowRouter.go('/data/overview?request=groups&specify=' + groupData.alias)}>
            {groupData.alias.length < 10 ? 
              groupData.alias :
              groupData.alias.substring(0, 9) + '...'}
          </button>
        </span>}
      {widgetData && 
        <span className='cookieCrumb'>
          <span className='crumb'></span>
          <button 
            className='cookie up numFont'
            onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget)}>
            {widgetData.widget.length < 16 ? 
              widgetData.widget :
              widgetData.widget.substring(0, 15) + '...'}
          </button>
        </span>}
      {versionData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget + '&specify=' + versionData.version)}>
            <i className='clean'> v.{versionData.version}</i>
          </button>
        </span>}
      {batchData && 
        <span className='cookieCrumb'>
          <span className='crumb'></span>
          <button 
            className='cookie numFont'
            onClick={()=>FlowRouter.go('/data/batch?request=' + batchData.batch)}>
            {batchData.batch}
          </button>
        </span>}
      {itemData && 
        <span className='cookieCrumb'>
          <span className='crumb'></span>
          <button 
            className='cookie numFont'
            onClick={()=>FlowRouter.go('/data/batch?request=' + batchData.batch + '&specify=' + itemData.serial)}>
            {itemData.serial}
          </button>
        </span>}
     
    </div>
  );
};

export default CookieBar;