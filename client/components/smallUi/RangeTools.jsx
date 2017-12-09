import React, {Component} from 'react';
import moment from 'moment';

export default class RangeTools extends Component	{
  
  time() {
    this.props.onChange(this.range.value, this.mod.value);
  }
  
  render() {
    
    return(
      <div className='rangeTools stickyBar'>
        <label>
          <button
            type='button'
            title='Auto updates every hour'
            onClick={this.time.bind(this)}
          >Update Now</button>
          <i className='breath clean'>
            Last updated at {moment(this.props.update).format('LT')}
          </i>
        </label>
        <label>
          <i className='breath'>Range</i>
          <label className='uniSelect'>
            <select
              onChange={this.time.bind(this)}
              ref={(i)=> this.mod = i}
              defaultValue={this.props.dfmod}>
              <option value='this'>Current</option>
              <option value='last'>Previous</option>
            </select>
          </label>
          <label className='uniSelect'>
            <select
              onChange={this.time.bind(this)}
              ref={(i)=> this.range = i}
              defaultValue={this.props.dfkeyword}>
              <option value='hour'>Hour</option>
              <option value='day'>Day</option>
              <option value='week'>Week</option>
              <option value='month' disabled={true}>Month</option>
            {/*<option value='quarter'>This Quarter</option>*/}
              <option value='year' disabled={true}>Year</option>
            </select>
          </label>
        </label>
      </div>
    );
  }
}