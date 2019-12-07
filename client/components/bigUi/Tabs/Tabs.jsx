import React, { useState } from 'react';
import './style.css';

const Tabs = ({ tabs, names, wide, stick, hold, sessionTab, children })=> {
  
  const [ sect, setSect ] = useState( Session.get(sessionTab) || 0 );

  function handleClick(clk) {
    setSect(clk);
    !hold ? null : Session.set(sessionTab, clk);
  }

  let show = sect;
  const sticky = stick ? 'stickyBar' : '';
  const styl = wide ? { width: 100 / tabs.length + '%'} : null;
    
  return (
    <div>
      <div className={sticky}>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'tabOn' : 'tabOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={clss}
              style={styl}
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