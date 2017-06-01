import React, {Component} from 'react';

export default class Freeze extends Component	{

  render() {

    return (
      <div className='ice'>
        <div className='space centre'>
          {this.props.children}
        </div>
      </div>
    );
  }
}