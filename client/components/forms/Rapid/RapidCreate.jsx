import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge';

const RapidCreate = ({ 
  batchId, groupId, hasSeries, srsQ, allQ,
  flows, lock 
})=> (
  <ModelLarge
    button={'New ' + Pref.xBatch}
    title={'Create New ' + Pref.xBatch}
    color='greenT'
    icon='fa-cubes'
    lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}>
    
    <RapidCreateForm
      groupId={groupId}
      batchId={batchId}
      hasSeries={hasSeries}
      srsQ={srsQ}
      allQ={allQ}
      flows={flows}
      
    />
  </ModelLarge>
);

export default RapidCreate;

const RapidCreateForm = ({ 
  batchId, batchNum, groupId, 
  hasSeries, srsQ, allQ, flows })=> {

  const [ typeState, typeSet ] = useState(false);
  const [ applyState, applySet ] = useState(false);
  
  function save(e) {
    e.preventDefault();
    
    const rType = this.rType.value.trim().toLowerCase();
    const issueNum = this.issNum.value.trim().toLowerCase();
    
    const exTime = this.hourNum.value;
    
    const endDate = this.eDate.value;
    const doneTarget = moment(endDate).endOf('day').format();
    
    const flowKey = this.flowKey.value;
    
    const falls = [];
    
    const howLink = this.howLink.value.trim();
    
    const applyAll = this.applyAll.checked;
    const quant = this.quant.value.trim().toLowerCase();
    
    const nonConArr = [];
    const shortArr = [];
    
    Meteor.call('addRapid', 
      batchId, groupId, rType, batchNum, issueNum,
      exTime, doneTarget, flowKey, falls, howLink, applyAll, quant,
      nonConArr, shortArr,
    
      (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          null;//FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          toast.warning('Duplicate');
        }
    });
  }
  
  
  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <div className='centreRow vmargin'>
        <label htmlFor='rType'>{Pref.version}</label><br />
        <select
          id='rType'
          onChange={(e)=>typeSet(e.target.value)}
          required>
            <option value={false}></option>
            <option value='repair'>Repair</option>
            <option value='refurb'>Refurbish</option>
            <option value='mod'>Modify</option>
        </select>
      
        <label htmlFor='issNum' className='breath'>Issue number<br />
        <input
          type='text'
          id='issNum'
          maxLength='32'
          minLength='3'
          required
        /></label>
      
      </div>
      
      <div className='centreRow vmargin'>
      
        <label htmlFor='hourNum' className='breath'>{Pref.timeBudget} (in hours)<br />
        <input
          type='number'
          id='hourNum'
          className='numberSet indenText'
          pattern="^\d*(\.\d{0,2})?$"
          maxLength='6'
          minLength='1'
          max='1000'
          min='0.01'
          step=".01"
          inputMode='numeric'
          placeholder='12.03'
          defaultValue={0}
          required
        /></label>

        <label htmlFor='eDate' className='breath'>{Pref.end} date<br />
        <input
          type='date'
          id='eDate'
          className='numberSet'
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required
        /></label>
      
      </div>
      
      <div className='centreRow vmargin'>
        
        <label className='breath'>Serialize<br />
          <label htmlFor='applyAll' className='beside'>
          <input
            type='checkbox'
            id='applyAll'
            className='indenText inlineCheckbox'
            onChange={(e)=>applySet(e.target.checked)}
            defaultChecked={false}
            disabled={!hasSeries}
          /><i className='medBig'>Apply to All Serials</i></label>
        </label>
        
        <label htmlFor='quant' className='breath'>Quantity<br />
        <input
          type='text'
          id='quant'
          pattern='[00000-99999]*'
          maxLength='5'
          minLength='1'
          inputMode='numeric'
          placeholder={allQ}
          defaultValue={applyState ? hasSeries ? srsQ : allQ : 0}
          required 
        /></label>
        
      </div>
      
      <div className='centreRow vmargin'>
        
        <label htmlFor='flowKey' className='breath'>Flow<br />
          <select 
            id='flowKey'
            disabled={!hasSeries}
            required>
          <option></option>
          {flows.map( (entry, index)=>{
            return(
             <option key={index} value={entry.flowKey}>{entry.title}</option>
             );
          })}
        </select></label>
        
        
        {typeState !== 'mod' ?
        
          <em> include autoNC and autoSH </em>
        
        :null}
      </div>
      
      <div className='vmargin'>
        <button
          type='submit'
          className='action clear greenHover'
        >Create</button>
      </div>
    </form>
  );
};



const AutoNC = ({ ncTypesCombo, user, editObj })=> {
  
  const [ nonConsState, nonConsSet ] = useState([]);

  
  useEffect( ()=>{
    if(!editObj) { null }else{
      nonConsSet(editObj.nonCons);
    }
  }, []);
  
   useEffect( ()=>{
    console.log(nonConsState);
  }, [nonConsState]);


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
  
  return(
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
            onInput={(e)=>handleCheck(e.target)}
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
  );
};