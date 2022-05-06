import React, { useState } from 'react';
import './style.css';

const Tabs = ({ tabs, names, wide, stick, hold, sessionTab, disable, children })=> {
  
  const ssn = Session.get(sessionTab);
  const dfTab = tabs[ssn] ? ssn : 0;
  
  const [ sect, setSect ] = useState( dfTab );

  function handleClick(clk) {
    setSect(clk);
    !hold ? null : Session.set(sessionTab, clk);
  }

  let show = sect;
  const sticky = stick ? 'stickInPlace' : '';
  const styl = wide ? { width: 100 / tabs.length + '%'} : null;
  const dA = Array.isArray(disable) ? disable : [];
  
  return(
    <div>
      <div className={sticky} style={{ display: 'flex' }}>
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
      <div className='tabBody'>

        {children[show]}
      
      </div>
    </div>
  );
};

export default Tabs;