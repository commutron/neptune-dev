import React, {Component} from 'react';

export default class Spin extends Component {
        
  render () {
    
    let styl = !this.props.color ? '/neptune-logo-white.svg' : '/neptune-logo-color.svg';
    
    return (
      <div className='loading'>
        <img
          src={styl}
          className='logoSVG shadow' />
      </div>
    );
  }
}