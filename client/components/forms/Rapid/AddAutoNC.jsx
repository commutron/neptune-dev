import React from 'react';


const AddAutoNC = ({ ncTypesCombo, user, nonConsState, nonConsSet, lockOut })=> {


  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
                                  
  function handleCheck(target) {
    let match = flatCheckList.find( x => x === target.value);
    let message = !match ? 'please choose from the list' : '';
    target.setCustomValidity(message);
    return !match ? false : true;
  }
  
  function handleNC(e) {
    const type = this.ncType.value.trim().toLowerCase();
    
    const tgood = handleCheck(this.ncType);
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    if(tgood && refSplit.length > 0 && refSplit[0] !== '') {
      
      let allNonCons = [...nonConsState];
      
      if(refSplit.length > 0 && refSplit[0] !== '') {
        for(let ref of refSplit) {
          ref = ref.replace(",", "");
          let ncObj = {'ref': ref, 'type': type};
          allNonCons.push(ncObj);
        }
        
        nonConsSet(allNonCons);
        this.ncRefs.value = '';
      }else{null}
    }else{
      this.ncType.reportValidity();
    }
  }
  
  function removeOne(entry) {
    const curr = new Set( nonConsState );
    const nope = entry;
    // take off selected step
    curr.delete(nope);
    // update state
    nonConsSet( [...curr] );
  }
  
  return(
    <div>
      <div className='inlineForm'>
      
        <label htmlFor='ncRefs' className='gapR'>Referances<br />
          <input
            type='text'
            id='ncRefs'
            className='up miniIn12'
            disabled={lockOut} />
        </label>
        
        
        <label htmlFor='ncType' className='gapR'>Type<br />
        {user.typeNCselection ?
          <span>
            <input 
              id='ncType'
              type='search'
              className='miniIn18'
              placeholder='Type'
              list='ncTypeList'
              onInput={(e)=>handleCheck(e.target)}
              disabled={ncTypesCombo.length < 1 || lockOut}
              autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
                // ^^^ workaround for persistent bug in desktop Firefox ^^^
            />
            <datalist id='ncTypeList'>
              {ncTypesCombo.map( (entry, index)=>{
                if(!entry.key) {
                  return ( 
                    <option 
                      key={index} 
                      value={entry}
                    >{index + 1}. {entry}</option>
                  );
                }else if(entry.live === true) {
                  let cd = user.showNCcodes ? `${entry.typeCode}. ` : '';
                  return( 
                    <option 
                      key={index}
                      data-id={entry.key}
                      value={entry.typeText}
                    label={cd + entry.typeText}
                  />
                  );
                }})
              }
            </datalist>
            </span>
            :
            <span>
              <select 
                id='ncType'
                className='redIn miniIn18'
                required
                disabled={ncTypesCombo.length < 1 || lockOut}
              >
              {ncTypesCombo.map( (entry, index)=>{
                if(!entry.key) {
                  return ( 
                    <option 
                      key={index} 
                      value={entry}
                    >{index + 1}. {entry}</option>
                  );
                }else if(entry.live === true) {
                  let cd = user.showNCcodes ? `${entry.typeCode}. ` : '';
                  return ( 
                    <option 
                      key={entry.key}
                      data-id={entry.key}
                      value={entry.typeText}
                      label={cd + entry.typeText}
                    />
                  );
              }})}
              </select>
            </span>
          }
        </label>
        
        <label><br /> 
          <button
            type='button'
            id='addNC'
            onClick={(e)=>handleNC(e)}
            disabled={lockOut}
            className='smallAction clearRed'
          >Add</button>
        </label>
        
      </div>
    
      <div className='stepList vmarginhalf'>
        {nonConsState.map( (entry, index)=> {
          return(                 
            <div key={index}>                      
              <div>{entry.ref}</div>
              <div>{entry.type}</div>
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

export default AddAutoNC;