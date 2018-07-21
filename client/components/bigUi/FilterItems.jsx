import React from 'react';

const FilterItems = ({ 
  advancedList,
  total,
  onClick,
  onStepChange,
  onTimeChange,
  onTxtChange,
  disableTime
})=>	{

  function changeBasicFilter() {
    onClick(this.basic.value);
  }
  function changeStepFilter() {
    onStepChange(this.step.value);
  }
  function changeTimeFilter() {
    onTimeChange(this.day.value);
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
            onChange={(e)=>changeTextFilter(e)} />
        </label>
        <label className='fltrsInput'>
          <i className='fas fa-map-marker-alt fa-fw'></i>
          <select
            ref={(i)=> this.basic = i}
            onChange={(e)=>changeBasicFilter(e)}>
            <option value='all'>All</option>
            <option value='done'>Finished</option>
            <option value='inproc'>In Progress</option>
            <option value='alt'>On Alt Flow</option>
            <option value='firsts'>First Offs</option>
            <option value='noncons'>With NonCons</option>
            <option value='shortfalls'>With Shortfalls</option>
            <option value='rma'>With an RMA</option>
            <option value='scrap'>Scrapped</option>
          </select>
        </label>
      </div>
        
      <div>
        <label className='fltrsInput'>
          <i className='fas fa-history fa-fw'></i>
          <select
            ref={(i)=> this.step = i}
            onChange={(e)=>changeStepFilter(e)}>
            <option value={false}>Any</option>
            {advancedList.map( (entry, index)=>{
              return(
                <option
                  key={index}
                  value={entry.key}
                >{entry.step === entry.type ? 
                  entry.step : 
                  entry.step + ' ' + entry.type}
                </option>
              );
            })}
          </select>
        </label>
        <label className='fltrsInput'>
          <i className='far fa-calendar-alt fa-fw'></i>
          <input
            type='date'
            ref={(i)=>this.day = i}
            onChange={(e)=>changeTimeFilter(e)}
            disabled={disableTime} />
        </label>
        </div>
        
      <p className='centreText'>Total: {total}</p>
    </details>
  );
};

export default FilterItems;