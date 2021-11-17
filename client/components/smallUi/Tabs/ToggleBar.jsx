import React from 'react';
import { toCap } from '/client/utility/Convert';

const ToggleBar = ({ toggleOptions, toggleIcons, toggleVal, toggleSet })=> {

  return(
    <div className='flexRR vmarginquarter'>

      {toggleOptions.map( (entry, index)=>{
        let clss = toggleVal === entry ? 'liteToolOn' : 'liteToolOff';
        return (
          <button
            key={index}
            onClick={()=>toggleSet(entry)}
            className={clss}
            title={toCap(entry, true)}
          >{toggleIcons ? toggleIcons[index] : entry}</button>
      )})}
        
    </div>
  );
};

export default ToggleBar;