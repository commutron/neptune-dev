import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
// requires
//button
//title
//type (className)
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
    }

  render() {
    
    let style = this.props.type ?
                this.props.type :
                'action clear cap';
    
    return (
      <span>
        <button
          className={style}
          onClick={this.reveal}
          disabled={this.props.lock}
        >{this.props.button}</button>
        {this.state.show ?
        <div className='overlay'>
          <div className='popup cap'>
            <button
              className='action clear redT rAlign'
              onClick={this.reveal}
            >{Pref.close}</button>
            <h2>{this.props.title}</h2>
            <hr />
              <div className='content'>
                {this.props.children}
              </div>
          </div>
        </div>
        : null }
      </span>
    );
  }
}