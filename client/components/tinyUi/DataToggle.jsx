import React, {Component} from 'react';

export default class DataToggle extends Component	{
  
  toggle() {
    const choice = this.choose.checked;
    Session.set('allData', choice);
    }
        
  render () {
    
    let on = Session.get('allData');
    let sty = on ? 
    {
      color: 'rgb(255,232,0)'
    }
    :
    {
      color: 'white'
    };
    
    return (
      <span className='actionIconWrap'>
        <input
          type='checkbox'
          id='dtToggle'
          ref={(i)=> this.choose = i}
          defaultChecked={on}
          onChange={this.toggle.bind(this)}
          readOnly />
          <label htmlFor='dtToggle' id='boltSwitch' className='navIcon'>
            <i className="fa fa-archive fa-lg fa-inverse" style={sty}></i>
            <span className='actionIconText' style={sty}>Archive Data</span>
          </label>
      </span>
    );
  }
}