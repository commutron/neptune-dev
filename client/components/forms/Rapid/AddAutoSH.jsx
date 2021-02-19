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
  
  return(
    <div className='inlineForm'>
    
      <label htmlFor='shRefs' className='breath'>Referances<br />
        <input
          type='text'
          id='shRefs'
          className='up miniIn12'
          disabled={lockOut} />
      </label>
      
      <label htmlFor='shPart' className='breath'>Part Number<br />
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
  );
};

export default AddAutoSH;