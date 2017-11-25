import React, {Component} from 'react';

export default class FilterItems extends Component	{
  
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
              id='inproc'
              title='In Regular Process'
              onChange={this.changeFilter.bind(this, 'inproc')} />
            <label htmlFor='inproc'>Active</label>
            
            <input
              type='radio'
              name='scale'
              id='done'
              title='Finished Regular Process'
              onChange={this.changeFilter.bind(this, 'done')} />
            <label htmlFor='done'>Finished</label>
            
          </span>
          
          <span className='comfort'>
          
            <i className='breath'></i>
            
            <input
              type='radio'
              name='scale'
              id='firsts'
              title='First Off Items'
              onChange={this.changeFilter.bind(this, 'firsts')} />
            <label htmlFor='firsts'>Firsts</label>
   
            <input
              type='radio'
              name='scale'
              id='---'
              title='---'
              onChange={this.changeFilter.bind(this, '---')}
              disabled />
            <label htmlFor='---'>---</label>
            
            <input
              type='radio'
              name='scale'
              id='----'
              title='----'
              onChange={this.changeFilter.bind(this, '----')}
              disabled />
            <label htmlFor='----'>---</label>
            
          </span>
          
          <span className='comfort'>
            <i className='breath'></i>
            
            <input
              type='radio'
              name='scale'
              id='lt'
              title='Alt Process'
              onChange={this.changeFilter.bind(this, 'alt')} />
            <label htmlFor='lt'>Alt</label>
            
            <input
              type='radio'
              name='scale'
              id='rma'
              title='RMA'
              onChange={this.changeFilter.bind(this, 'rma')} />
            <label htmlFor='rma'>RMA</label>
            
            <input
              type='radio'
              name='scale'
              id='scrp'
              title='Scrapped'
              onChange={this.changeFilter.bind(this, 'scrap')} />
            <label htmlFor='scrp'>Scrapped</label>
            
          </span>
          
          <span className='balance'>
          
            {this.props.advancedTitle ?
              <span>
                <label className='tweekUp'>{this.props.advancedTitle}</label>
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