import React, {Component} from 'react';

export default class DataToggle extends Component	{
  
  toggle() {
    const choice = this.refs.choose.checked;
    Session.set('allData', choice);
    }
        
  render () {
    return (
      <span>
        <input
          type='checkbox'
          id='dtToggle'
          ref='choose'
          defaultChecked={Session.get('allData')}
          onChange={this.toggle.bind(this)}
          readOnly />
          <label htmlFor='dtToggle' id='boltSwitch' className='navIcon'>
            <i className="fa fa-bolt fa-2x"></i>
            <span className='icontext'>Powerup</span>
          </label>
      </span>
    );
  }
}