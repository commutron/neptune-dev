import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { NonConCheck } from '/client/utility/NonConOptions';

const NCFlood = ({ seriesId, live, user, app, ncTypesCombo })=> {
  
  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  function handleFloodNC(e) {
    this.go.disabled = true;
    e.preventDefault();
    const type = this.ncType.value.trim();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refCut = refEntry.replace(Pref.listCut, "|");
    const refSplit = refCut.split("|");
    
    const tgood = NonConCheck(this.ncType, flatCheckList);
    
    if( !tgood || refSplit.length < 1 || refSplit[0] === '' ) {
      this.ncRefs.reportValidity();
      this.ncType.reportValidity();
      this.go.disabled = false;
    }else{
      toast.warn('Please Wait For Confirmation...', {
        toastId: ( 'floodpOp' ),
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: false
      });
      for(let ref of refSplit) {
        if(ref.length < 8) {
          Meteor.call('floodNCX', seriesId, ref, type, (error, reply)=>{
            error && console.log(error);
            if(reply) {
              toast.update(( 'floodpOp' ), {
                render: "NonConformance has been added to all Work In Progress items",
                type: toast.TYPE.SUCCESS,
                autoClose: 3000
              });
              this.ncRefs ? this.ncRefs.value = '' : null;
              this.go ? this.go.disabled = false : null;
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
          <label htmlFor='ncRefs' className='whiteT'>{Pref.nonConRef}</label>
        </span>
        {user.typeNCselection ?
          <span>
            <input 
              id='ncType'
              className='redIn'
              type='search'
              placeholder='Type'
              list='ncTypeList'
              onInput={(e)=>NonConCheck(e.target, flatCheckList)}
              required
              disabled={lock || ncTypesCombo.length < 1}
              autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
                // ^^^ workaround for persistent bug in desktop Firefox ^^^
            />
            <label htmlFor='ncType' className='whiteT'>{Pref.nonConType}</label>
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
            <label htmlFor='ncType' className='whiteT'>{Pref.nonConType}</label>
          </span>
        }
          <button
            type='submit'
            id='go'
            disabled={lock}
            className='smallAction clearRed bold'
          >Record On All WIP {Pref.items}</button>
      </form>
    </fieldset>
  );
};

export default NCFlood;