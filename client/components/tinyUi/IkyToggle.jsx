import React, {Component} from 'react';

export default class IkyToggle extends Component	{
  
  toggle() {
    const choice = this.choose.checked;
    Session.set('ikyView', choice);
    let findBox = document.getElementById('find');
		findBox ? findBox.focus() : null;
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
          <label htmlFor='ikyToggle' id='snapSwitch' className='navIcon dataFlip'>
            <span className='actionIconText'>View</span>
          </label>
      </span>
    );
  }
}