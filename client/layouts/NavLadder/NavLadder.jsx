import React from 'react';
import Pref from '/public/pref.js';

import './navladder.css';

const NavLadder = ({ 
  alias, widget, variant,
  batch, item, 
})=> (
  <div className='ladderRow'>
    {alias &&
      <LadderButton
        label={alias}
        title={`${Pref.group}: ${alias}`}
        uri={'/data/overview?request=groups&specify=' + alias}
      />}
        
    {widget && 
      <LadderButton
        label={widget}
        sub={variant}
        title={`${Pref.widget}: ${widget}${variant && ' v.'+ variant}`}
        uri={'/data/widget?request=' + widget}
        crmb={true}
      />}
      
    {batch && 
      <LadderButton
        label={batch}
        title={`${Pref.xBatch}: ${batch}`}
        uri={'/data/batch?request=' + batch}
        crmb={true}
      />}
      
    {item && <span className='endRung'></span>}
  </div>
);

export default NavLadder;

const LadderButton = ({ label, sub, title, uri, crmb })=> (
  <button 
    className='ladderRung numFont up'
    title={title}
    onClick={()=>FlowRouter.go(uri)}>
    {crmb && <span className='rung'></span>}
    <span className='ladder'>{label}{sub && <i className='clean'>{' v.'+ sub}</i>}</span>
  </button>
  
);