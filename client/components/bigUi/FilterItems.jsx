import React from 'react';

const FilterItems = ({ 
  title,
  total,
  advancedList,
  selectedKeyword,
  selectedTime,
  selectedToggle,
  onKeywordChange,
  onTimeChange,
  onNotChange,
  disableTime,
})=>	{
  
  function changeKeywordFilter() {
    onKeywordChange(this.keyword.value);
  }
  function changeTimeFilter() {
    onTimeChange(this.day.value);
  }
  function changeNotFilter() {
    onNotChange(this.toggle.checked);
  }
    
  return(
    <div className='itmFltrBlock noCopy'>
    
      <div>
        <label htmlFor='notToggle' className='onoffFilter'>
          <input
            type='checkbox'
            id='notToggle'
            //defaultChecked={selectedToggle}
            ref={(i)=>this.toggle = i}
            onChange={(e)=>changeNotFilter(e)}
            checked={selectedToggle} />
          {!selectedToggle ?
            <b id='itmTglOFF'><i className='fas fa-filter fa-lg fa-fw'></i></b> :
            <span id='itmTglON' title='NOT' className="fa-layers fa-fw">
              <i className='fas fa-filter fa-lg fa-fw'></i>
              <i className="fas fa-ban fa-2x fa-fw redT" data-fa-transform="left-2"></i>
            </span>}
        </label>
        <select
          ref={(i)=>this.keyword = i}
          defaultValue={selectedKeyword}
          onChange={(e)=>changeKeywordFilter(e)}
          required>
          <option value={false} label='' />
          <optgroup label='Categories'>
            <option value='complete'>Complete</option>
            <option value='in progress'>In Progress</option>
            <option value='alternative'>Alternative Flow</option>
            <option value='first offs'>First Offs</option>
            <option value='nonconformances'>Nonconformances</option>
            <option value='shortfalls'>Shortfalls</option>
            <option value='rma'>RMA</option>
            <option value='scrap'>Scrap</option>
          </optgroup>
          <optgroup label='Steps'>
            {advancedList.map( (entry, index)=>{
              return(
                <option
                  key={index}
                  value={'@' + entry.key}
                >{entry.step === entry.type ? 
                  entry.step : 
                  entry.step + ' ' + entry.type}
                </option>
              );
            })}
          </optgroup>
        </select>
      </div>
      
      <div>
        <span className='itmFltrStatic'>
          <i className='far fa-calendar-alt fa-lg fa-fw'></i>
        </span>
        <input
          type='date'
          ref={(i)=>this.day = i}
          defaultValue={selectedTime}
          onChange={(e)=>changeTimeFilter(e)}
          disabled={
            disableTime || 
            selectedKeyword === 'alternative' ||
            selectedKeyword === 'rma'
          } />
      </div>
        
      <p className='centreText'>Total: {total}</p>
    </div>
  );
};

export default FilterItems;