import React from 'react';

const DumbFilter = ({ size, onTxtChange })=>	{
  
  function changeTextFilter() {
    onTxtChange(this.text.value);
  }
  
  return(
    <div className='centre noCopy'>
      <p className=''>
        <label className={'variableInput ' + size}>
          <i className={size + ' fas fa-filter fa-fw' || 'med fas fa-filter fa-fw'}></i>
        </label>
        <input
          type='search'
          className={'variableInput ' + size}
          ref={(i)=>this.text = i}
          onChange={(e)=>changeTextFilter(e)}
          autoFocus={true}
          disabled={!onTxtChange} />
      </p>
      <p className='med'>
        <i>Filter by any text, not case sensitve</i>
      </p>
    </div>
    
  );
};
  
export default DumbFilter;