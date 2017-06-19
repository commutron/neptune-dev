import React, {Component} from 'react';

export default class TimeFrame extends Component {

  render () {
    
    let sty = {
      width: '100%',
      border: '0',
      position: 'absolute',
      top: '50%',
      left: '0',
      overflowY: 'hidden',
      overflowX: 'hidden',
      transform: 'translate(0%, -50%)',
      zIndex: '10',
      backgroundColor: 'transparent'
    };
    
    // this keeps the time clock iframe loaded at all times
    // that could be a preformance problem
    // but its good for user experience
    let show = this.props.time ?
    {
      display: 'block'
    }
    :
    {
      display: 'none'
    };
    
    return (
      <div style={show}>
      
        <iframe
          id='getPaid'
          style={sty}
          src={this.props.go}
          height='600'
          scrolling='yes'
          />
        
      </div>
    );
  }
}