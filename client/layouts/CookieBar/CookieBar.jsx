import React from 'react';
import Pref from '/client/global/pref.js';

import './cookie';

const CookieBar = ({ 
  alias, widget, variant,
  batch, item, 
})=> (
  <div className='cookieRow'>
    {alias && 
      <button 
        className='cookieCrumb up numFont' 
        title={`${Pref.group}: ${alias}`}
        onClick={()=>FlowRouter.go('/data/overview?request=groups&specify=' + alias)}
      ><span className='cookie'>{alias}</span>
      </button>}
        
    {widget && 
      <button 
        className='cookieCrumb up numFont'
        title={`${Pref.widget}: ${widget}${variant && ' v.'+ variant}`}
        onClick={()=>FlowRouter.go('/data/widget?request=' + widget)}>
        <span className='crumb'></span>
        <span className='cookie'>{widget} <i className='clean'>{variant && ' v.'+ variant}</i></span>
      </button>}
      
    {batch && 
      <button 
        className='cookieCrumb numFont'
        title={`${Pref.xBatch}: ${batch}`}
        onClick={()=>FlowRouter.go('/data/batch?request=' + batch)}>
        <span className='crumb'></span>
        <span className='cookie'>{batch}</span>
      </button>}
      
    {item && <span className='endCrumb'></span>}
  </div>
);

export default CookieBar;