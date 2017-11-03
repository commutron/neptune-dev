import React, {Component} from 'react';

export default class Spin extends Component {
        
  render () {
    
    let img = !this.props.color ? '/neptune-logo-white.svg' : '/neptune-logo-color.svg';
    let sty = { height: '50vh' };
    
    return (
      <div className='loading'>
        <img
          src={img}
          className='logoSVG shadow'
          style={sty} />
      </div>
    );
  }
}