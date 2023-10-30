import React from 'react';
import Pref from '/client/global/pref.js';

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
})=> (
  <div className='itmFltrBlock noCopy'>
  
    <div>
      <label className='fltrsInput'>
        <label htmlFor='fltItmNotToggle' className='onoffFilter'>
          <input
            type='checkbox'
            id='fltItmNotToggle'
            onChange={(e)=>onNotChange(e.target.checked)}
            checked={selectedToggle} 
            />
          {!selectedToggle ?
            <b id='itmTglOFF'><i className='fas fa-filter fa-lg fa-fw'></i></b> :
            <span id='itmTglON' title='NOT' className="fa-layers fa-fw">
              <i className='fas fa-filter fa-lg fa-fw'></i>
              <i className="fas fa-ban fa-2x fa-fw redT" data-fa-transform="left-3"></i>
            </span>}
        </label>
        <select
          id='fltItmkeyword'
          defaultValue={selectedKeyword}
          onChange={(e)=>onKeywordChange(e.target.value)}
          required>
          <option value={false} label='' />
          <optgroup label='Categories'>
            <option value='complete'>Complete</option>
            <option value='in progress'>In Progress</option>
            <option value='first offs'>{Pref.trackFirst}s</option>
            <option value='nonconformances'>{Pref.nonCons}</option>
            <option value='shortfalls'>{Pref.shortfalls}</option>
            <option value='alternative'>Alternative Flow</option>
            <option value='extended'>{Pref.rapidExd} Flow</option>
            <option value='scrap'>{Pref.scrapped}</option>
          </optgroup>
          <optgroup label='Steps' className='cap'>
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
      </label>
    </div>
    
    <div>
      <label className='fltrsInput'
      ><i className='far fa-calendar-alt fa-lg fa-fw'></i>
      <input
        type='date'
        id='fltItmdate'
        defaultValue={selectedTime}
        onChange={(e)=>onTimeChange(e.target.value)}
        disabled={disableTime} 
      />
      </label>
    </div>
      
    <p className='centreText margin5' style={{fontSize: "calc(0.7rem + 0.3vw)"}}>{total} items</p>
  </div>
);

export default FilterItems;