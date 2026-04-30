import React from 'react';

const DumbFilter = ({ id, title, size, wrapClass, inputClass, styleOv, onTxtChange, list })=> (
  <label title={title || ''} className={`noWrap ${wrapClass || ''}`}>
    <i className='fas fa-filter fa-fw'></i>
    <input
      id={id}
      list='shortcuts'
      type='search'
      className={inputClass || ''}
      style={styleOv}
      onChange={(e)=>onTxtChange(e.target.value)}
      autoFocus={true}
      disabled={!onTxtChange} 
      required />
    <datalist id='shortcuts'>
      {list && list.map( (entry, index)=>( 
        <option key={index} value={entry} className={size}>{entry}</option>
      ))}
    </datalist>
  </label>
);
  
export default DumbFilter;