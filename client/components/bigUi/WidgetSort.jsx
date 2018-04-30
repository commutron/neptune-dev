import React from 'react';

const FilterActive = ({ onChange, onTxtChange })=>	{
  
  function changeBasicFilter() {
    onChange(this.basicWS.value);
  }
  function changeTextFilter() {
    onTxtChange(this.textWS.value);
  }
  
  return(
    <div className='listSort noCopy'>
      
      <div>
        <label className='listSortInput'>
          <i className='fas fa-font fa-fw'></i>
          <input
            type='search'
            ref={(i)=>this.textWS = i}
            onChange={(e)=>changeTextFilter(e)}
            disabled={!onTxtChange} />
        </label>
        <label className='listSortInput'>
          <i className='fas fa-map-marker-alt fa-fw'></i>
          <select
            ref={(i)=> this.basicWS = i}
            onChange={(e)=>changeBasicFilter(e)}>
            <option value='all'>All</option>
            <option value='done'>Finished</option>
            <option value='inproc'>In Progress</option>
          </select>
        </label>
      </div>
        
      
    </div>
    
  );
};
  
export default FilterActive;