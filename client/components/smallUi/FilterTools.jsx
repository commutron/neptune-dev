import React, {Component} from 'react';

export default class ItemsList extends Component	{
  
  changeFilter(keyword) {
    this.props.onClick(keyword);
  }
  
  render() {
    
    let dStyl = {
      lineHeight: '12px',
      textIndent: '-5px',
      margin: '5px 0',
      padding: '0 10px'
    };
    
    return(
      
      <details className='fltrs' style={dStyl}>
          <summary className='fltrs'>
            <span>
              <i className='fa fa-filter' aria-hidden='true'></i>
              <i className='med'>Filter</i>
            </span>
            <span className='rAlign'>
              <i className='fa fa-chevron-down' aria-hidden='true'></i>
            </span>
          </summary>
          
          <br />
          
          <span className='comfort'>
            <input
              type='radio'
              name='scale'
              id='all'
              title='All'
              defaultChecked={true}
              onChange={this.changeFilter.bind(this, 'all')} />
            <label htmlFor='all'>All</label>
         
            <input
              type='radio'
              name='scale'
              id='done'
              title='Done'
              onChange={this.changeFilter.bind(this, 'done')} />
            <label htmlFor='done'>Done</label>
   
            <input
              type='radio'
              name='scale'
              id='inproc'
              title='In Process'
              onChange={this.changeFilter.bind(this, 'inproc')} />
            <label htmlFor='inproc'>In Process</label>
        
          </span>
          
          <hr />
          
          <p className='centreText'>Total: {this.props.total}</p>
          
          <br />
          
        </details>
      
    );
  }
}