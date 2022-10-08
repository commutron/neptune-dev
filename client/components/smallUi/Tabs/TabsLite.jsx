import React, { useState } from 'react';
import './style.css';
import { toCap } from '/client/utility/Convert.js';

const TabsLite = ({ tabs, names, children, tcls, left })=> {
  
  const [ show, showSet ] = useState( 0 );
  
  return(
    <div className={'posRel ' + tcls || ''}>
      <div className={`liteTabs vmarginhalf ${left ? '' : 'flexRR'}`}>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'liteToolOn' : 'liteToolOff';
          return (
            <button
              key={index}
              data-tip={names ? toCap(names[index], true) : ''}
              onClick={()=>showSet(index)}
              className={`${clss} ${names ? 'liteTip' : ''}`}
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