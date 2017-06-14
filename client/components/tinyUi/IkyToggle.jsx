import React, {Component} from 'react';

export default class IkyToggle extends Component	{
  
  toggle() {
    const choice = this.choose.checked;
    Session.set('ikyView', choice);
    }
        
  render () {
    return (
      <span>
        <input
          type='checkbox'
          id='ikyToggle'
          ref={(i)=> this.choose = i}
          defaultChecked={Session.get('ikyView')}
          onChange={this.toggle.bind(this)}
          readOnly />
          <label htmlFor='ikyToggle' id='snapSwitch' className='navIcon'>
            <span className='fa-stack fa-2x'>
              <i className='fa fa-circle fa-stack-2x'></i>
              <i className="fa fa-window-restore fa-stack-1x fa-inverse"></i>
            </span>
          </label>
      </span>
    );
  }
}