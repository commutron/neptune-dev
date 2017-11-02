import React, {Component} from 'react';
import moment from 'moment';

export default class RangeTools extends Component	{
  
  time() {
    this.props.onChange(this.range.value);
  }
  
  render() {
    
    return(
      <div className='rangeTools'>
        <label>
          <button type='button' onClick={this.time.bind(this)}>
            Update Now
          </button>
          <i className='breath clean'>
            Auto updates every hour, 
            Last Updated at {moment(this.props.update).format('LT')}
          </i>
        </label>
        <label className='uniSelect'>
          <i className='breath'>Range</i>
          <select
            onChange={this.time.bind(this)}
            ref={(i)=> this.range = i}
            defaultValue={this.props.dfkeyword}>
            <option value='hour'>This Hour</option>
            <option value='day'>Today</option>
            <option value='week'>This Week</option>
          </select>
        </label>
      </div>
    );
  }
}