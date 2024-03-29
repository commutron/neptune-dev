import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { NonConCheck, onFire } from '/client/utility/NonConOptions';

export const AddAutoNCwrap = ({ rapidData, ncTypesCombo, rSetItems, user, editAuth })=> {
  
  const defaultNC = rapidData ? rapidData.autoNC || [] : [];
  
  const [ editState, editSet ] = useState( false );
  const [ nonConsState, nonConsSet ] = useState( defaultNC );
  
  function handleSave() {
      
    const nonConArr = nonConsState;
  
    Meteor.call('setExRapidNC', rapidData._id, nonConArr, (error, reply)=> {
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
  
  if(rapidData.type === 'modify') {
    return null;
  }
  
  return(
    <div className='vmargin'>
      
      <dt className='fullline'>Auto {Pref.nonCons}</dt>
      
      <AddAutoNC
        ncTypesCombo={ncTypesCombo} 
        user={user}
        nonConsState={nonConsState}
        nonConsSet={nonConsSet}
        rSetItems={rSetItems}
        editState={editState} />
  
      {editState ?
        <span className='rightRow'>
          <button
            type='button'
            className='miniAction med gap'
            onClick={()=>editSet(false)}
          ><n-fa1><i className='far fa-edit'></i></n-fa1> cancel</button>
          
          <button
            className='smallAction gap nHover'
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

const AddAutoNC = ({ ncTypesCombo, user, nonConsState, nonConsSet, rSetItems, editState })=> {

  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  function handleNC(e) {
    const type = this.ncType.value.trim().toLowerCase();
    
    const tgood = NonConCheck(this.ncType, flatCheckList);
    
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
    curr.delete(nope);
    nonConsSet( [...curr] );
  }
  
  return(
    <div>
      {editState && rSetItems > 0 ?
      <p className='trueyellow centreText'
        >Only applied to newly {Pref.rapidExd} {Pref.items}
      </p> : null}
      {editState &&
      <div className='inlineForm interForm rightRow'>
      
        <label htmlFor='ncRefs' className='gapR'>Referances<br />
          <input
            type='text'
            id='ncRefs'
            className='up miniIn12 interInput'
            required
          />
        </label>
        
        
        <label htmlFor='ncType' className='gapR'>Type<br />
        {user.typeNCselection ?
          <span>
            <input 
              id='ncType'
              type='search'
              className='miniIn18 interInput'
              placeholder='Type'
              list='ncTypeList'
              onInput={(e)=>NonConCheck(e.target, flatCheckList)}
              disabled={ncTypesCombo.length < 1}
              autoComplete={onFire()}
            />
            <datalist id='ncTypeList'>
              {ncTypesCombo.map( (entry, index)=>{
                let cd = !user.showNCcodes ? '' :
                         entry.typeCode ? `${entry.typeCode}. ` : `${index + 1}. `;
                if(!entry.key) {
                  return ( 
                    <option 
                      key={index} 
                      value={entry}
                      label={cd + entry}
                    />
                  );
                }else if(entry.live === true) {
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
                className='miniIn18 interSelect'
                required
                disabled={ncTypesCombo.length < 1}
              >
              {ncTypesCombo.map( (entry, index)=>{
                let cd = !user.showNCcodes ? '' :
                         entry.typeCode ? `${entry.typeCode}. ` : `${index + 1}. `;
                if(!entry.key) {
                  return ( 
                    <option 
                      key={index} 
                      value={entry}
                      label={cd + entry}
                    />
                  );
                }else if(entry.live === true) {
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
            className='smallAction blackHover'
          >Add</button>
        </label>
        
      </div>
      }
      
      <div className='gateList w100 vmarginhalf'>
        {nonConsState.map( (entry, index)=> {
          return(                 
            <div key={index}>                      
              <div>{entry.ref}</div>
              <div>{entry.type}</div>
              {!editState ? <span></span> :
              <div>
                <button
                  type='button'
                  name='Remove'
                  id='ex'
                  className='smallAction redHover'
                  onClick={()=>removeOne(entry)}
                ><i className='fas fa-times'></i></button>
              </div>}
            </div>
        )})}
      </div>
    </div>
  );
};

export default AddAutoNC;