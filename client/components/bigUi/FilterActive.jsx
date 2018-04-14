import React from 'react';

const FilterActive = ({ total, onClick })=>	{
  
  function changeBasicFilter() {
    onClick(this.basic.value);
  }
  
  return(
    <details className='fltrs noCopy'>
      <summary className='fltrs'>
        <span>
          <i className='fas fa-filter'></i>
          <i className='med'>Filter</i>
        </span>
        <span className='rAlign'>
          <i className='fas fa-chevron-down fa-fw'></i>
        </span>
      </summary>
      
      <div>
        <label className='fltrsInput'>
          <i className='fas fa-map-marker-alt fa-fw'></i>
          <select
            ref={(i)=> this.basic = i}
            onChange={(e)=>changeBasicFilter(e)}>
            <option value='all'>All</option>
            <option value='done'>Finished</option>
            <option value='inproc'>In Progress</option>
          </select>
        </label>
      </div>
          
      <hr />
      
      <p className='centreText'>Total: {total}</p>
      
      <br />
      
    </details>
    
  );
};
  
export default FilterActive;