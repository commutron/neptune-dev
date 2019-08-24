import React from 'react';

const FilterActive = ({ title, open, done, total, onClick, onTxtChange })=>	{
  
  function changeBasicFilter() {
    onClick(this.basic.value);
  }
  function changeTextFilter() {
    onTxtChange(this.text.value);
  }
  
  return(
    <div className='fltrs noCopy'>
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
          
      <div className='wide centreText'>Total: {total}</div>
      
    </div>
  );
};
  
export default FilterActive;