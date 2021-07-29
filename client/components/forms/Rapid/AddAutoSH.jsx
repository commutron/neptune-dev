import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import '/client/components/bigUi/ArrayBuilder/style.css';

export const AddAutoSHwrap = ({ rapidData, vassembly, editAuth })=> {
  
  const defaultSH = rapidData ? rapidData.autoSH || [] : [];
  
  const [ editState, editSet ] = useState( false );
  const [ shortState, shortSet ] = useState( defaultSH );
  
  function handleSave() {
      
    const shortArr = shortState;
  
    Meteor.call('setExRapidSH', rapidData._id, shortArr, (error, reply)=> {
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        null;
      }else{
        toast.warning('error');
      }
    });
    editSet(false);
  }
  
  return(
    <div className='vmargin'>
      
      <dt className='fullline'>Auto Shortfalls</dt>
      
      <AddAutoSH
        vassembly={vassembly}
        shortState={shortState}
        shortSet={shortSet}
        editState={editState} />
  
      {editState ?
        <span className='rightRow'>
          <button
            type='button'
            className='miniAction med gap'
            onClick={()=>editSet(false)}
          ><n-fa1><i className='far fa-edit'></i></n-fa1> cancel</button>
          
          <button
            className='smallAction gap clearBlue'
            onClick={()=>handleSave()}
            disabled={!rapidData.live}
          >Save</button>
        </span>
      :
        <span className='rightRow'>
          <button
            title={!editAuth ? Pref.norole : !rapidData.live ? 'not open' : ''}
            className='miniAction gap'
            onClick={()=>editSet(true)}
            disabled={!rapidData.live || !editAuth}
          ><n-fa2><i className='fas fa-edit'></i></n-fa2> edit</button>
        </span>
      }
      
    </div>
  );
};

const AddAutoSH = ({ vassembly, shortState, shortSet, editState })=> {
  
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
    {editState ?
      <div className='inlineForm interForm'>
        <label htmlFor='shRefs'>Referances<br />
          <input
            type='text'
            id='shRefs'
            className='up miniIn12 interInput'
            required />
        </label>
      
        <label htmlFor='shPart'>Part Number<br />
          <input
            type='text'
            id='shPart'
            list='shPartList'
            className='up miniIn18 interInput'
            required />
        </label>
          
        <datalist id='shPartList'>
          {vassembly.map( (entry)=>( 
            <option 
              key={entry.component} 
              value={entry.component}
            >{entry.component}</option>
          ))}
        </datalist>
      
        <label><br />   
          <button
            type='button'
            id='addSH'
            onClick={(e)=>handleSH(e)}
            className='smallAction clearOrange'
          >Add</button>
        </label>
      </div>
    : null}
    
      <div className='gateList w100 vmarginhalf'>
        {shortState.map( (entry, index)=> {
          return(                 
            <div key={index} className='up'>                      
              <div>{entry.refs}</div>
              <div>{entry.part}</div>
              {!editState ? <span></span> :
                <div>
                  <button
                    type='button'
                    name='Remove'
                    id='ex'
                    className='smallAction redHover'
                    onClick={()=>removeOne(entry)}
                  ><i className='fas fa-times'></i></button>
                </div>
              }
            </div>
        )})}
      </div>
    </div>
  );
};

export default AddAutoSH;