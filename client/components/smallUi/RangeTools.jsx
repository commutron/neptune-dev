import React, {Component} from 'react';
import moment from 'moment';

const RangeTools = ({ onChange, update, dfkeyword }) => {
  
  function time(e) {
    onChange(this.range.value);
  }
    
  return(
    <div className='rangeTools stickyBar'>
      <label>
        <button
          type='button'
          title='Auto updates every hour'
          onClick={(e)=>time(e)}
        >Update Now</button>
        <i className='breath clean'>
          Last updated at {moment(update).format('LT')}
        </i>
      </label>
      <label>
        <i className='breath'>Range</i>
        <label className='uniSelect'>
          <select
            onChange={(e)=>time(e)}
            ref={(i)=> this.range = i}
            defaultValue={dfkeyword}>
            <option value='day'>Today</option>
            <option value='week'>This Week</option>
          </select>
        </label>
      </label>
    </div>
  );
};

export default RangeTools;