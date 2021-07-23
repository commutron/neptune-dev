import React, { useState } from 'react';
import './style.css';

const TabsLite = ({ tabs, names, children })=> {
  
  const [ show, showSet ] = useState( 0 );
  
  return(
    <div>
      <div className='liteTabs flexRR'>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'liteToolOn' : 'liteToolOff';
          return (
            <button
              key={index}
              title={names ? names[index] : ''}
              onClick={()=>showSet(index)}
              className={clss}
            >{entry}</button>
        )})}
      </div>
        <div className='tabBody'>
          {children.map( (child, index)=>{
            return (
              <span key={index+'tab'} hidden={index !== show}>
               {child}
              </span>
          )})}
        </div>
    </div>
  );
};

export default TabsLite;