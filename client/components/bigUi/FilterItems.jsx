import React from 'react';

const FilterItems = ({ 
  advancedList,
  total,
  selectedKeyword,
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
            ref={(i)=>this.toggle = i}
            onChange={(e)=>changeNotFilter(e)}
            checked={selectedToggle} />
          {!selectedToggle ?
            <b id='itmTglOFF'><i className='fas fa-filter fa-lg fa-fw'></i></b> :
            <span id='itmTglON' className="fa-layers fa-fw">
              <i className='fas fa-filter fa-lg fa-fw'></i>
              <i className="fas fa-ban fa-2x fa-fw redT" data-fa-transform="left-2"></i>
            </span>}
        </label>
        <select
          ref={(i)=>this.keyword = i}
          onChange={(e)=>changeKeywordFilter(e)}>
          <option value={false} label='' />
          <optgroup label='Categories'>
            <option value='Complete' label='Complete' />
            <option value='In Progress' label='In Progress' />
            <option value='Alternative' label='Alternative Flow' />
            <option value='First Offs' label='First Offs' />
            <option value='Nonconformances' label='Nonconformances' />
            <option value='Shortfalls' label='Shortfalls' />
            <option value='RMA' label='RMA' />
            <option value='Scrap' label='Scrap' />
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