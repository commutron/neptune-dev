import React from 'react';

const DumbFilter = ({ id, size, onTxtChange, labelText, list })=>	{
  
  function changeTextFilter() {
    onTxtChange(this.text.value);
  }
  
  return(
    <div className='centre noCopy'>
      <p className='med nomargin'>
        <i>{labelText}</i>
      </p>
      <p className=''>
        <label className={'blackT variableInput ' + size}>
          <i className={size + ' fas fa-filter fa-fw' || 'med fas fa-filter fa-fw'}></i>
        </label>
        <input
          id={id}
          list='shortcuts'
          type='search'
          className={'variableInput ' + size}
          ref={(i)=>this.text = i}
          onChange={(e)=>changeTextFilter(e)}
          autoFocus={true}
          disabled={!onTxtChange} 
          required />
        <datalist id='shortcuts'>
          {list && list.map( (entry, index)=>{
            return ( 
              <option key={index} value={entry} className={size}>{entry}</option>
          )})}
        </datalist>
      </p>
      
    </div>
    
  );
};
  
export default DumbFilter;