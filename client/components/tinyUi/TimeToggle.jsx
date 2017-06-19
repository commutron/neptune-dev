import React, {Component} from 'react';

export default class TimeToggle extends Component	{
  
  
  toggle() {
    const choice = this.choose.checked;
    Session.set('timeClock', choice);
    }
        
  render () {
    
  let sty = {
    zIndex: '11'
  };
    return (
      <span style={sty}>
        <input
          type='checkbox'
          id='timeToggle'
          ref={(i)=> this.choose = i}
          defaultChecked={Session.get('timeClock')}
          onChange={this.toggle.bind(this)}
          readOnly />
          <label htmlFor='timeToggle' id='timeSwitch' className='navIcon'>
            <i className='fa fa-clock-o fa-2x' aria-hidden='true'></i>
            <span className='icontext'>Time Clock</span>
          </label>
      </span>
    );
  }
}