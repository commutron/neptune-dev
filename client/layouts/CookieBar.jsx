import React from 'react';
import Pref from '/client/global/pref.js';

const CookieBar = ({ 
  groupData, 
  widgetData, variantData,
  batchData, itemData, 
  app, 
  action, miniAction
}) => {
  
  return(
    <div className='cookieRow'>
      {groupData && 
        <span className='cookieCrumb' title={`${Pref.group}: ${groupData.alias}`}>
          <button 
            className='cookie up numFont'
            onClick={()=>FlowRouter.go('/data/overview?request=groups&specify=' + groupData.alias)}>
            {groupData.alias.length < 10 ? 
              groupData.alias :
              groupData.alias.substring(0, 9) + '...'}
          </button>
        </span>}
      {widgetData && 
        <span className='cookieCrumb' title={`${Pref.widget}: ${widgetData.widget}`}>
          <span className='crumb'></span>
          <button 
            className='cookie up numFont'
            onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget)}>
            {widgetData.widget.length < 16 ? 
              widgetData.widget :
              widgetData.widget.substring(0, 15) + '...'}
          </button>
        </span>}
      {variantData && 
        <span className='cookieCrumb' title={`${Pref.variant}: ${variantData.variant}`}>
          <span className='crumb'><i className='fas fa-chevron-right fa-lg'></i></span>
          <button 
            className='cookie'
            onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget + '&specify=' + variantData.variant)}>
            <i className='clean'> v.{variantData.variant}</i>
          </button>
        </span>}
      {batchData && 
        <span className='cookieCrumb' title={`${Pref.batch}: ${batchData.batch}`}>
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
        </span>}
     
    </div>
  );
};

export default CookieBar;