import React from 'react';

const FilterActive = ({ total, onClick, onTxtChange })=>	{
  
  function changeBasicFilter() {
    onClick(this.basic.value);
  }
  function changeTextFilter() {
    onTxtChange(this.text.value);
  }
  
  return(
    <details className='fltrs noCopy'>
      <summary className='fltrs'>
        <span>
          <i className='fas fa-filter fa-fw'></i>
          <i className='med'>Filter</i>
        </span>
        <span className='rAlign'>
          <i className='fas fa-chevron-down fa-fw'></i>
        </span>
      </summary>
      
      <div>
        <label className='fltrsInput'>
          <i className='fas fa-font fa-fw'></i>
          <input
            type='search'
            ref={(i)=>this.text = i}
            onChange={(e)=>changeTextFilter(e)}
            disabled={!onTxtChange} />
        </label>
        <label className='fltrsInput'>
          <i className='fas fa-map-marker-alt fa-fw'></i>
          <select
            ref={(i)=> this.basic = i}
            onChange={(e)=>changeBasicFilter(e)}>
            <option value='all'>All</option>
            <option value='done'>Inactive</option>
            <option value='inproc'>In Progress</option>
          </select>
        </label>
      </div>
          
      <p className='centreText'>Total: {total}</p>
      
    </details>
    
  );
};
  
export default FilterActive;