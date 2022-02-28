import React from 'react';
import { toCap } from '/client/utility/Convert';

const ToggleBar = ({ toggleOptions, toggleIcons, toggleVal, toggleSet })=> {

  return(
    <div className='flexRR vmarginquarter'>

      {toggleOptions.map( (entry, index)=>{
        let clss = toggleVal === entry ? 'liteTip liteToolOn' : 'liteTip liteToolOff';
        return (
          <button
            key={index}
            onClick={()=>toggleSet(entry)}
            className={clss}
            data-tip={toCap(entry, true)}
          >{toggleIcons ? toggleIcons[index] : entry}</button>
      )})}
        
    </div>
  );
};

export default ToggleBar;