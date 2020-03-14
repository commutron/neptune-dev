import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
import FlowBuilder from '/client/components/bigUi/ArrayBuilder/FlowBuilder.jsx';
//requires
// id
// barcode

const RMAForm = ({ 
  id, editObj, trackOptions, end,
  app, user,
  noText, small,
  ncTypesCombo 
})=> {
  
  const [ flowState, flowSet ] = useState(false);
  const [ nonConsState, nonConsSet ] = useState([]);

  
  useEffect( ()=>{
    if(!editObj) { null }else{
      flowSet(true);
      nonConsSet(editObj.nonCons);
    }
  }, []);


  const flatCheckList = ncTypesCombo.length > 0 ?
    Array.from(ncTypesCombo, x => x.live === true && x.typeText)
    : app.nonConOption;
  
  function handleCheck(e) {
    let match = flatCheckList.find( x => x === e.target.value);
    let message = !match ? 'please choose from the list' : '';
    e.target.setCustomValidity(message);
  }
  
  
  function setFlow(recSet) {
    let input = recSet;
    if(!input) {
      flowSet(false);
    }else{
      flowSet([...input]);
    }
  }
  
  function handleNC(e) {
    const type = this.ncType.value.trim().toLowerCase();
    let match = flatCheckList.find( x => x === type);
    if(match) {
      const refEntry = this.ncRefs.value.trim().toLowerCase();
      const refSplit = refEntry.split(/\s* \s*/);
      
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
      this.ncType.setCustomValidity('invalid type');
    }
    
  }
  
  function save(e) {
    e.preventDefault();
    this.rmaGo.disabled = true;
    const cKey = editObj.key;
    const flowObj = flowState;
    const nonConArr = nonConsState;
    
    const rmaId = this.rmaNum.value.trim().toLowerCase();
    const quantity = this.quant.value.trim().toLowerCase();
    const comm = this.comm.value.trim().toLowerCase();
    
    if(cKey) {
      Meteor.call('editRMACascade', id, cKey, rmaId, quantity, comm, nonConArr, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        this.rmaOut.value = 'saved';
      });
      
    }else{
    
      if(!flowObj) {
        toast.warning('Not saved');
      }else{
        Meteor.call('addRMACascade', id, rmaId, quantity, comm, flowObj, nonConArr, (error)=>{
          if(error)
            console.log(error);
          toast.success('Saved');
          this.rmaNum.value = '';
          this.quant.value = '';
          this.comm.value = '';
          this.rmaOut.value = 'saved';
          flowSet(false);
          nonConsSet([]);
        });
      }
    }
  }
  
  function clean(e) {
    this.rmaOut.value = '';
  }
  
  const edit = editObj ? editObj : false;
  const numE = edit ? edit.rmaId : '';
  const quE = edit ? edit.quantity : '';
  const quC = edit ? edit.comm : '';
  const title = edit ? 'edit ' + Pref.rmaProcess : 'create ' + Pref.rmaProcess;
  const bttn = edit ? 'edit' : Pref.rmaProcess;
    
  return (
    <Model
      button={bttn}
      title={title}
      color='orangeT'
      icon='fa-exchange-alt'
      smIcon={small}
      lock={!Roles.userIsInRole(Meteor.userId(), 'qa')}
      noText={noText}>
      <div className='space'>
        <form
          id='rmaSave'
          className='centre'
          onSubmit={(e)=>save(e)}
          onChange={(e)=>clean(e)}
        >
          <p>
            <input
              type='text'
              id='rmaNum'
              defaultValue={numE}
              placeholder='RMA Number'
              required />
            <label htmlFor='rmaNum'>RMA number</label>
          </p>
          <p>
            <input
              type='number'
              id='quant'
              defaultValue={quE}
              placeholder='0 is infinite' />
            <label htmlFor='quant'>Quantity</label>
          </p>
          <p>
            <input
              type='text'
              id='comm'
              defaultValue={quC}
              placeholder='other details' />
            <label htmlFor='comm'>Comment</label>
          </p>
          
          <p><em>automatic {Pref.nonCon}s on every activated {Pref.item}</em></p>
          
          <div className='inlineForm'>
    
          <input
            type='text'
            id='ncRefs'
            className='redIn up'
            placeholder={Pref.nonConRef} />
          
          {user.typeNCselection ?
          <span>
          <input 
            id='ncType'
            className='redIn'
            type='search'
            placeholder='Type'
            list='ncTypeList'
            onInput={(e)=>handleCheck(e)}
            disabled={ncTypesCombo.length < 1}
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
              className='redIn'
              required
              disabled={ncTypesCombo.length < 1}
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
          
          <button
            type='button'
            id='addNC'
            onClick={(e)=>handleNC(e)}
            disabled={false}
            className='smallAction clearRed'
          >Add</button>
        
        </div>
        
        </form>
      </div>
      
      <div className='centre'>
        <dl>
          {nonConsState.map( (entry, index)=>{
            return(
              <dt key={index}>{entry.ref} - {entry.type}</dt>
          )})}
        </dl>
      </div>
      
      <br />
      
      <hr />
        
      {!editObj ?
      
        <FlowBuilder
          app={app}
          options={trackOptions.filter( x => x.type !== 'first')}
          end={end}
          baseline={false}
          onClick={(e)=>setFlow(e)} />
          
      : <p>{Pref.flow} is locked</p>}


      <hr />
      
      <div className='space centre'>
        <button
          type='submit'
          id='rmaGo'
          disabled={!flowState}
          form='rmaSave'
          className='action clearGreen'>SAVE</button>
        <p><output id='rmaOut' /></p>
        <br />
      </div>
    </Model>
  );
};

export default RMAForm;