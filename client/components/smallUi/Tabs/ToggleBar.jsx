import React from 'react';

const ToggleBar = ({ toggleOptions, toggleVal, toggleSet })=> {

  return(
    <div className='flexRR vmarginquarter'>

      {toggleOptions.map( (entry, index)=>{
        let clss = toggleVal === entry ? 'liteToolOn' : 'liteToolOff';
        return (
          <button
            key={index}
            onClick={()=>toggleSet(entry)}
            className={clss}
          >{entry}</button>
      )})}
        
    </div>
  );
};

export default ToggleBar;