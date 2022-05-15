import React from 'react';
import Pref from '/client/global/pref.js';

import './cookie';

const CookieBar = ({ 
  alias, widget, variant,
  batch, item, 
}) => (
  <div className='cookieRow'>
  
    {alias && 
      <button 
        className='cookieCrumb up numFont' 
        title={`${Pref.group}: ${alias}`}
        onClick={()=>FlowRouter.go('/data/overview?request=groups&specify=' + alias)}
      > {alias.length < 10 ? 
          alias :
          alias.substring(0, 9) + '...'}
      </button>}
        
    {widget && 
      <button 
        className='cookieCrumb up numFont'
        title={`${Pref.widget}: ${widget}${variant && ' v.'+ variant}`}
        onClick={()=>FlowRouter.go('/data/widget?request=' + widget)}>
        <span className='crumb'></span> {widget.length < 16 ? 
                                          widget :
                                            widget.substring(0, 15) + '...'}
        <i className='clean'>{variant && ' v.'+ variant}</i>
      </button>}
      
    {batch && 
      <button 
        className='cookieCrumb numFont'
        title={`${Pref.xBatch}: ${batch}`}
        onClick={()=>FlowRouter.go('/data/batch?request=' + batch)}
      >
        <span className='crumb'></span> {batch}
      </button>}
      
    {item && 
      <span className='endCrumb'></span>}
   
  </div>
);

export default CookieBar;