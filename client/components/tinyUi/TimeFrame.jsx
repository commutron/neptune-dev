import React, {Component} from 'react';

export default class TimeFrame extends Component {

  render () {
    
    let sty = {
      width: '100%',
      border: '0',
      position: 'absolute',
      top: '75px',
      left: '0',
      overflowY: 'hidden',
      overflowX: 'hidden',
    };
    
    return (
      <div className='layerFix'>
      {this.props.time ?
        <iframe
          id='getPaid'
          style={sty}
          src={this.props.go}
          height='600'
          scrolling='yes'
          />
          : null}
      </div>
    );
  }
}