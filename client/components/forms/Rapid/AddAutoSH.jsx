import React from 'react';


const AddAutoSH = ({ vassembly, shortState, shortSet, lockOut })=> {
  
  function handleSH(e) {
    const part = this.shPart.value.trim().toLowerCase();
    
    const refs = this.shRefs.value.trim().toLowerCase();
    
    let allShort = [...shortState];
    
    let shObj = {'refs': refs, 'part': part};
    allShort.push(shObj);
    
    shortSet(allShort);
    this.shPart.value = '';
    this.shRefs.value = '';
  }
  
  function removeOne(entry) {
    const curr = new Set( shortState );
    const nope = entry;
    // take off selected
    curr.delete(nope);
    // update state
    shortSet( [...curr] );
  }
  
  return(
    <div>
      <div className='inlineForm'>
      
        <label htmlFor='shRefs' className='gapR'>Referances<br />
          <input
            type='text'
            id='shRefs'
            className='up miniIn12'
            disabled={lockOut} />
        </label>
      
        <label htmlFor='shPart' className='gapR'>Part Number<br />
          <input
            type='text'
            id='shPart'
            list='shPartList'
            className='up miniIn18'
            disabled={lockOut} />
        </label>
          
        <datalist id='shPartList'>
          {vassembly.map( (entry)=>{
            return( 
              <option key={entry.component} value={entry.component}>{entry.component}</option>
            );
          })}
        </datalist>
      
        <label><br />   
          <button
            type='button'
            id='addSH'
            onClick={(e)=>handleSH(e)}
            disabled={lockOut}
            className='smallAction clearOrange'
          >Add</button>
        </label>
      </div>
    
      <div className='stepList vmarginhalf'>
        {shortState.map( (entry, index)=> {
          return(                 
            <div key={index}>                      
              <div>{entry.refs}</div>
              <div>{entry.part}</div>
              <div>
                <button
                  type='button'
                  name='Remove'
                  id='ex'
                  className='smallAction redHover'
                  onClick={()=>removeOne(entry)}
                ><i className='fas fa-times'></i></button>
              </div>
            </div>
        )})}
      </div>
    </div>
  );
};

export default AddAutoSH;