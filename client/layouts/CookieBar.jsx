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
        <button 
          className='cookieCrumb up numFont' 
          title={`${Pref.group}: ${groupData.alias}`}
          onClick={()=>FlowRouter.go('/data/overview?request=groups&specify=' + groupData.alias)}
        > {groupData.alias.length < 10 ? 
            groupData.alias :
            groupData.alias.substring(0, 9) + '...'}
        </button>}
        
      {widgetData && 
        <button 
          className='cookieCrumb up numFont' 
          title={`${Pref.widget}: ${widgetData.widget}`}
          onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget)}>
          <span className='crumb'></span> {widgetData.widget.length < 16 ? 
                                            widgetData.widget :
                                              widgetData.widget.substring(0, 15) + '...'}
        </button>}
        
      {variantData && 
        <button 
          className='cookieCrumb clean'
          title={`${Pref.variant}: ${variantData.variant}`}
          onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget + '&specify=' + variantData.variant)}>
          <span className='crumb'></span> v.{variantData.variant}
        </button>}
        
      {batchData && 
        <button 
          className='cookieCrumb numFont'
          title={`${Pref.batch}: ${batchData.batch}`}
          onClick={()=>FlowRouter.go('/data/batch?request=' + batchData.batch)}
        >
          <span className='crumb'></span> {batchData.batch}
        </button>}
        
      {itemData && 
        <span className='endCrumb'></span>}
     
    </div>
  );
};

export default CookieBar;