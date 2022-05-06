import React from 'react';
import Pref from '/client/global/pref.js';

import './cookie';

const CookieBar = ({ 
  groupData, 
  widgetData, variantData,
  batchData, itemData, 
  app, 
  action, miniAction
}) => (
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
        title={`${Pref.widget}: ${widgetData.widget}${variantData && ' v.'+variantData.variant}`}
        onClick={()=>FlowRouter.go('/data/widget?request=' + widgetData.widget)}>
        <span className='crumb'></span> {widgetData.widget.length < 16 ? 
                                          widgetData.widget :
                                            widgetData.widget.substring(0, 15) + '...'}
        <i className='clean'>{variantData && ' v.'+variantData.variant}</i>
      </button>}
      
    {batchData && 
      <button 
        className='cookieCrumb numFont'
        title={`${Pref.xBatch}: ${batchData.batch}`}
        onClick={()=>FlowRouter.go('/data/batch?request=' + batchData.batch)}
      >
        <span className='crumb'></span> {batchData.batch}
      </button>}
      
    {itemData && 
      <span className='endCrumb'></span>}
   
  </div>
);

export default CookieBar;