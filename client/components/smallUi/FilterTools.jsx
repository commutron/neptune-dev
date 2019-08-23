import React from 'react';

const FilterTools = (props)=> {
  
  function changeFilter(keyword) {
    props.onClick(keyword);
  }
  
  function changeAdvancedFilter(e) {
    props.onChange(e.target.un.value);
  }
    
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
          <i className='fas fa-filter'></i>
          <i className='med'>Filter</i>
        </span>
        <span className='rAlign'>
          <i className='fas fa-chevron-down'></i>
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
          onChange={()=>changeFilter('all')} />
        <label htmlFor='all'>All</label>
     
        <input
          type='radio'
          name='scale'
          id='done'
          title='Done'
          onChange={()=>changeFilter('done')} />
        <label htmlFor='done'>Done</label>

        <input
          type='radio'
          name='scale'
          id='inproc'
          title='In Process'
          onChange={()=>changeFilter('inproc')} />
        <label htmlFor='inproc'>In Process</label>
      
      </span>
      
      <span className='balance'>
      
        {props.advancedTitle ?
          <span>
            <label>{props.advancedTitle}</label>
            <select
              id='un'
              onChange={(e)=>changeAdvancedFilter(e)}
              style={sStyl}>
              <option></option>
              {props.advancedList.map( (entry, index)=>{
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
      
      <p className='centreText'>Total: {props.total}</p>
      
      <br />
      
    </details>
    
  );
};

export default FilterTools;