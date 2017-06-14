import React, {Component} from 'react';

export default class Spin extends Component {
        
  render () {
    return (
      <div className='loading'>
        <img
          src='/neptune-logo-white.svg'
          className='logoSVG shadow' />
      </div>
    );
  }
}