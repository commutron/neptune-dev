import React, {Component} from 'react';

export default class FilterTools extends Component	{
  
  changeFilter(keyword) {
    this.props.onClick(keyword);
  }
  
  changeAdvancedFilter() {
    this.props.onChange(this.un.value);
  }
  
  render() {
    
    let dStyl = {
      lineHeight: '12px',
      textIndent: '3px',
      margin: '5px 0',
      padding: '0 10px'
    };
    
    let sStyl = {
      minHeight: '1.5rem',
      maxWidth: '150px',
      lineHeight: '1rem',
      fontSize: '1.25rem',
      margin: '5px auto'
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
          
            <i className='breath'></i>
            
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
          
          <span className='balance'>
          
            {this.props.advancedTitle ?
              <span>
                <label>{this.props.advancedTitle}</label>
                <select
                  ref={(i)=> this.un = i}
                  onChange={this.changeAdvancedFilter.bind(this)}
                  style={sStyl}>
                  <option></option>
                  {this.props.advancedList.map( (entry, index)=>{
                    return(
                      <option
                        key={index}
                        value={entry.key}
                        style={sStyl}>{entry.step} {entry.type}
                      </option>
                    );
                  })}
                </select>
              </span>
            : null}
          
          </span>
            
          <hr />
          
          <p className='centreText'>Total: {this.props.total}</p>
          
          <br />
          
        </details>
      
    );
  }
}