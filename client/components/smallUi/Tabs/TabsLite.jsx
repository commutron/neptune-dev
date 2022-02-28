import React, { useState } from 'react';
import './style.css';
import { toCap } from '/client/utility/Convert.js';

const TabsLite = ({ tabs, names, children })=> {
  
  const [ show, showSet ] = useState( 0 );
  
  return(
    <div>
      <div className='liteTabs flexRR'>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'liteTip liteToolOn' : 'liteTip liteToolOff';
          return (
            <button
              key={index}
              data-tip={names ? toCap(names[index], true) : ''}
              onClick={()=>showSet(index)}
              className={clss}
            >{entry}</button>
        )})}
      </div>
        <div className='tabBody'>
          {children[show]}
        </div>
    </div>
  );
};

export default TabsLite;