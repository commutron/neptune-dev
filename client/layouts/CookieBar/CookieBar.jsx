import React from 'react';
import Pref from '/public/pref.js';

import './cookie';

const CookieBar = ({ 
  alias, widget, variant,
  batch, item, 
})=> (
  <div className='cookieRow'>
    {alias &&
      <CookieButton
        label={alias}
        title={`${Pref.group}: ${alias}`}
        uri={'/data/overview?request=groups&specify=' + alias}
      />}
        
    {widget && 
      <CookieButton
        label={widget}
        sub={variant}
        title={`${Pref.widget}: ${widget}${variant && ' v.'+ variant}`}
        uri={'/data/widget?request=' + widget}
        crmb={true}
      />}
      
    {batch && 
      <CookieButton
        label={batch}
        title={`${Pref.xBatch}: ${batch}`}
        uri={'/data/batch?request=' + batch}
        crmb={true}
      />}
      
    {item && <span className='endCrumb'></span>}
  </div>
);

export default CookieBar;

const CookieButton = ({ label, sub, title, uri, crmb })=> (
  <button 
    className='cookieCrumb numFont up'
    title={title}
    onClick={()=>FlowRouter.go(uri)}>
    {crmb && <span className='crumb'></span>}
    <span className='cookie'>{label}{sub && <i className='clean'>{' v.'+ sub}</i>}</span>
  </button>
  
);