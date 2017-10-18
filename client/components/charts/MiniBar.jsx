import React, {Component} from 'react';

//<MiniBar title={} total={} value={} />

export default class MiniBar extends Component	{
  
  render() {
    
    const v = this.props.count;
    const t = this.props.total;
    
    let name = {
      position: 'relative',
      top: '0.75rem',
    };
    
    let bar = {
      width: '100%'
    };
    
    let num = {
      textAlign: 'right'
    };
    
    return(
      <span className='wide'>
        <p style={name} className='cap'>{this.props.title}</p>
        <progress style={bar} className='proGood' value={v} max={t}></progress>
        <p style={num}>{v}/{t}</p>
      </span>
    );
  }
}