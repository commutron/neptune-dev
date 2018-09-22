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
    //document.getElementById('find').focus();
  }

  render() {
    
    const noText = this.props.noText;
    let iSize = this.props.primeTopRight ? ' fa-2x ' :
                this.props.smIcon ? ' fa-1x ' : ' fa-lg ';
    
    return (
      <span>
        <button
          title={this.props.title}
          className='transparent'
          onClick={this.reveal}
          disabled={this.props.lock}>
          <label className='navIcon actionIconWrap'>
            <i className={'fas ' + this.props.icon + iSize + this.props.color}></i>
            {!noText && <span className={'actionIconText ' + this.props.color}>{this.props.button}</span>}
          </label>
        </button>
      
        {this.state.show &&
        <AnimateWrap type='modelTrans' el='span'>
          <div className='overlay invert' key={1}>
            <div className='popup'>
              <div className='popupHead'>
                <span>
                  <i className={'fas ' + this.props.icon + ' fa-lg ' + this.props.color}></i>
                  <i className='breath'></i>
                  {this.props.title}
                </span>
                <button
                  className='action clearRed rAlign'
                  onClick={this.reveal}
                  title='close'
                ><i className='fas fa-times fa-lg'></i></button>
              </div>
              <div className='popupContent'>
                {this.props.children}
              </div>
            </div>
          </div>
        </AnimateWrap>
        }
      </span>
    );
  }
}