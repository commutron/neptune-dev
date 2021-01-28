import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const NCFlood = ({ seriesId, live, user, app, ncTypesCombo })=> {
  
  function handleCheck(target) {
    const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
    let match = flatCheckList.find( x => x === target.value);
    let message = !match ? 'please choose from the list' : '';
    target.setCustomValidity(message);
    return !match ? false : true;
  }
  
  function handleFloodNC(e) {
    this.go.disabled = true;
    e.preventDefault();
    const type = this.ncType.value.trim();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(/\s* \s*/);
    
    const tgood = handleCheck(this.ncType);
    
    if( !tgood || refSplit.length < 1 || refSplit[0] === '' ) {
      this.ncRefs.reportValidity();
      this.ncType.reportValidity();
      this.go.disabled = false;
    }else{
      for(let ref of refSplit) {
        ref = ref.replace(",", "");
        if(ref.length < 8) {
          toast.warn('Please Wait For Confirmation...', {
            toastId: ( 'floodpOp' ),
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false
          });
          Meteor.call('floodNCX', seriesId, ref, type, (error, reply)=>{
            error && console.log(error);
            if(reply) {
              toast.update(( 'floodpOp' ), {
                render: "NonConformance has been added to all Work In Progress items",
                type: toast.TYPE.SUCCESS,
                autoClose: 3000
              });
              this.ncRefs.value = '';
              this.go.disabled = false;
            }
          });
        }else{
          toast.warn("Can't add '" + ref + "', A referance can only be 7 characters long", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 10000,
            closeOnClick: false
          });
          this.go.disabled = false;
        }
      }
      // const findBox = document.getElementById('lookup');
      // findBox.focus();
    }
  }

	let lock = !live;
	
  return (
    <fieldset
        disabled={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])}
        className='noBorder nomargin nospace'>
      <form
        className='actionForm'
        onSubmit={(e)=>handleFloodNC(e)}>
        <span>
          <input
            type='text'
            id='ncRefs'
            className='redIn up'
            placeholder={Pref.nonConRef}
            disabled={lock}
            required />
          <label htmlFor='ncRefs'>{Pref.nonConRef}</label>
        </span>
        {user.typeNCselection ?
          <span>
            <input 
              id='ncType'
              className='redIn'
              type='search'
              placeholder='Type'
              list='ncTypeList'
              onInput={(e)=>handleCheck(e.target)}
              required
              disabled={lock || ncTypesCombo.length < 1}
              autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
                // ^^^ workaround for persistent bug in desktop Firefox ^^^
            />
            <label htmlFor='ncType'>{Pref.nonConType}</label>
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
                  return ( 
                    <option 
                      key={index}
                      data-id={entry.key}
                      value={entry.typeText}
                      label={cd + entry.typeText}
                    />
                  );
              }})}
            </datalist>
          </span>
        :
          <span>
            <select 
              id='ncType'
              className='redIn'
              required
              disabled={lock || ncTypesCombo.length < 1}
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
            <label htmlFor='ncType'>{Pref.nonConType}</label>
          </span>
        }
          <button
            type='submit'
            id='go'
            disabled={lock}
            className='smallAction clearRed bold'
          >Record On All WIP</button>
      </form>
    </fieldset>
  );
};

export default NCFlood;