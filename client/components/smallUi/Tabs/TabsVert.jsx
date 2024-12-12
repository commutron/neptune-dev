import React, { useState } from 'react';
import './style.css';

const TabsVert = ({ tabs, names, disable, extraClass, children })=> {
  
  const [ sect, setSect ] = useState( 0 );

  function handleClick(clk) {
    setSect(clk);
  }

  let show = sect;
  const dA = Array.isArray(disable) ? disable : [];
  
  return(
    <div className={`tabsVert ${extraClass || ''}`}>
      <div className='tabsVertMenu'>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'tabOn' : 'tabOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={'noPrint '+clss}
              disabled={dA[index]}
            >{entry} {names && names[index]}</button>
        )})}
      </div>
      <div className='tabsVertContent'>

        {children[show]}
      
      </div>
    </div>
  );
};

export default TabsVert;