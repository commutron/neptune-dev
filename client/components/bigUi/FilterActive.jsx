import React from 'react';

const FilterActive = ({ total, onClick, onTxtChange })=>	{
  return(
    <div className='itmFltrBlock noCopy'>
      <div className=''>
        <label className='fltrsInput'>
          <i className='fas fa-font fa-fw'></i>
          <input
            type='search'
            id='fltrtext'
            onChange={(e)=>onTxtChange(e.target.value)}
            disabled={!onTxtChange} />
        </label>
      </div>
      <div>
        <label className='fltrsInput'>
          <i className='fas fa-map-marker-alt fa-fw'></i>
          <select
            id='fltrbasic'
            onChange={(e)=>onClick(e.target.value)}>
            <option value='all'>All</option>
            <option value='inproc'>In Progress</option>
            <option value='done'>Inactive</option>
          </select>
        </label>
      </div>
          
      <p className='centreText margin5' style={{fontSize: "calc(0.7rem + 0.3vw)"}}>Total: {total}</p>
      
    </div>
  );
};
  
export default FilterActive;