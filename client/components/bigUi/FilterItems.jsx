import React from 'react';

const FilterItems = ({ advancedTitle, advancedList, total, onClick, onChange })=>	{

  function changeBasicFilter() {
    onClick(this.basic.value);
  }
  
  function changeAdvancedFilter() {
    onChange({step: this.un.value, time: this.day.value});
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
              <option value='alt'>On Alt Flow</option>
              <option value='firsts'>First Offs</option>
              <option value='noncons'>With NonCons</option>
              <option value='rma'>With an RMA</option>
              <option value='scrap'>Scrapped</option>
            </select>
          </label>
        </div>
          
        {advancedTitle ?
          <div>
            <label className='fltrsInput'>
              <i className='fas fa-history fa-fw'></i>
              <select
                ref={(i)=> this.un = i}
                onChange={(e)=>changeAdvancedFilter(e)}>
                <option></option>
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
                onChange={(e)=>changeAdvancedFilter(e)} />
            </label>
          </div>
        : null}
          
        <hr />
        <p className='centreText'>Total: {total}</p>
        <br />
      </details>
  );
};

export default FilterItems;