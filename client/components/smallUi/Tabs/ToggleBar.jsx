import React from 'react';
import { toCap } from '/client/utility/Convert';

const ToggleBar = ({ toggleOptions, toggleIcons, toggleVal, toggleSet })=> {

  return(
    <div className='flexRR vmarginquarter posRel'>

      {toggleOptions.map( (entry, index)=>{
        let tog = toggleVal === entry ? 'liteToolOn' : 'liteToolOff';
        return (
          <button
            key={index}
            onClick={()=>toggleSet(entry)}
            className={`${tog} ${toggleIcons ? 'liteTip' : '' }`}
            data-tip={toCap(entry, true)}
          >{toggleIcons ? toggleIcons[index] : entry}</button>
      )})}
        
    </div>
  );
};

export default ToggleBar;