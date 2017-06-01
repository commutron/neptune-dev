import React, {Component} from 'react';

// requires title
// requires num

export default class StatBox extends Component	{

  render() {

    return (
      <div className='infoBox in'>
        <div className='titleBar'>{this.props.title}</div>
        <p>{this.props.num}</p>
      </div>
    );
  }
}