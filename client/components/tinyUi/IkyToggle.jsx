import React, {Component} from 'react';

export default class IkyToggle extends Component	{
  
  toggle() {
    const choice = this.refs.choose.checked;
    Session.set('ikyView', choice);
    }
        
  render () {
    return (
      <span>
        <input
          type='checkbox'
          id='ikyToggle'
          ref='choose'
          defaultChecked={Session.get('ikyView')}
          onChange={this.toggle.bind(this)}
          readOnly />
          <label htmlFor='ikyToggle' id='snapSwitch'>
            <i className='fa fa-window-restore fa-2x' aria-hidden='true'></i>
          </label>
      </span>
    );
  }
}