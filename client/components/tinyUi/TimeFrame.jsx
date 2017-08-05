import React, {Component} from 'react';

export default class TimeFrame extends Component {

  render () {
    
    let sty = {
      width: '100%',
      height: 'calc(100vh - 150px)',
      border: '0',
      position: 'absolute',
      top: '75px',
      left: '0',
      overflowY: 'hidden',
      overflowX: 'hidden',
      backgroundColor: 'transparent'
    };
    
    // this keeps the time clock iframe loaded at all times
    // that could be a preformance problem
    // but its good for user experience
    let show = this.props.time ?
               { display: 'block' } : 
               { display: 'none' };
    
    return (
      <div style={show}>
      
        <iframe
          id='getPaid'
          style={sty}
          src={this.props.go}
          scrolling='yes'
          />
        
      </div>
    );
  }
}