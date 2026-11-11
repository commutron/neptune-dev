import React, { Fragment, useState } from 'react';
import './style.css';

const Tabs = ({ 
  tabs, names, wide, stick, tabcss, bodycss,
  hold, sessionTab, disable, children 
})=> {
  
  const ssn = Session.get(sessionTab);
  const dfTab = tabs[ssn] ? ssn : 0;
  
  const [ sect, setSect ] = useState( dfTab );

  function handleClick(clk) {
    setSect(clk);
    !hold ? null : Session.set(sessionTab, clk);
  }

  let show = sect;
  const sticky = stick ? 'stickInPlace' : '';
  const styl = wide ? { width: '100%'} : null;
  const dA = Array.isArray(disable) ? disable : [];
  
  return(
    <Fragment>
      <div className={`${sticky} ${tabcss || ''}`} style={{ display: 'flex' }}>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'tabOn' : 'tabOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={'noPrint '+clss}
              style={styl}
              disabled={dA[index]}
            >{entry} {names && names[index]}</button>
        )})}
      </div>
      <div className={`tabBody ${bodycss || ''}`}>

        {children[show]}
      
      </div>
    </Fragment>
  );
};

export default Tabs;