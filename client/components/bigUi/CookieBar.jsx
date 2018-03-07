import { Meteor } from 'meteor/meteor';
import React from 'react';

const CookieBar = ({ groupData, widgetData, versionData, batchData, itemData, action }) => {
            
  return(
    <div className='cookieRow'>
      {groupData && 
        <span className='cookieCrumb'>
          <button 
            className='cookie up'
            onClick={()=>FlowRouter.go('/data/group?request=' + groupData.alias)}>
            {groupData.alias}
          </button>
        </span>}
      {widgetData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie cap'
            onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget)}>
            {widgetData.widget}
          </button>
        </span>}
      {/*versionData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/version?request=' + versionData.version)}>
            v.{versionData.version}
          </button>
        </span>*/}
      {batchData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/batch?request=' + batchData.batch)}>
            {batchData.batch}
          </button>
        </span>}
      {itemData && 
        <span className='cookieCrumb'>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/serial?request=' + itemData.serial)}>
            {itemData.serial}
          </button>
        </span>}
      
     
    </div>
  );
};

export default CookieBar;