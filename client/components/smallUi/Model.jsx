import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
// requires
//button
//title
//color // css class
//lock
//children

export default class Model extends Component	{
  
  constructor() {
    super();
    this.state = {
      show: false
   };
    this.reveal = this.reveal.bind(this);
  }
  reveal() {
    this.setState({ show: !this.state.show });
    const findBox = document.getElementById('find');
  	findBox ? findBox.focus() : null;
  }

  render() {
    
    let iSize = this.props.smIcon ? ' fa-1x ' : ' fa-2x ';
    
    return (
      <span>
        <button
          title={this.props.title}
          className='transparent'
          onClick={this.reveal}
          disabled={this.props.lock}>
          <label className='navIcon actionIconWrap'>
            <i className={'fa ' + this.props.icon + iSize + this.props.color} aria-hidden='true'></i>
            <span className={'actionIconText ' + this.props.color}>{this.props.button}</span>
          </label>
        </button>
      
        {this.state.show ?
        <AnimateWrap type='modelTrans' el='span'>
          <div className='overlay' key={1}>
            <div className='popup'>
              <button
                className='action clear redT rAlign'
                onClick={this.reveal}>{Pref.close}</button>
              <h2 className='cap'>
                <i className={'fa ' + this.props.icon + ' fa-lg ' + this.props.color}></i>
                <i className='breath'></i>
                {this.props.title}
              </h2>
              <hr />
                <div className='content'>
                  {this.props.children}
                </div>
            </div>
          </div>
        </AnimateWrap>
        : null }
      </span>
    );
  }
}