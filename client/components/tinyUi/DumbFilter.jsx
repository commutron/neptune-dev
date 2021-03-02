import React from 'react';

const DumbFilter = ({ id, size, onTxtChange, labelText, list })=>	{
  
  function changeTextFilter() {
    onTxtChange(this.text.value);
  }
  
  return(
    <div className='centre vmarginhalf noCopy'>
      <p>
        <label className={`blackT variableInput ${size}`}>
          <i className='fas fa-filter fa-fw'></i>
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
      <p className='nomargin'>
        <i>{labelText}</i>
      </p>
    </div>
  );
};
  
export default DumbFilter;