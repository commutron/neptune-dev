import React, {Component} from 'react';

export default class TimeToggle extends Component	{
  
  
  toggle() {
    const choice = this.choose.checked;
    Session.set('timeClock', choice);
    let findBox = document.getElementById('find');
		findBox.focus();
  }
  
  render () {
    
  let sty = {
    zIndex: '11'
  };
  
  //let icon = 'fa fa-clock-o fa-2x';
  
    return (
      <span style={sty}>
        <input
          type='checkbox'
          id='timeToggle'
          ref={(i)=> this.choose = i}
          defaultChecked={Session.get('timeClock')}
          onChange={this.toggle.bind(this)}
          readOnly />
          <label htmlFor='timeToggle' id='timeSwitch' className='navIcon customTimeClock'>
            <span className='icontext'>Time Clock</span>
          </label>
      </span>
    );
  }
}