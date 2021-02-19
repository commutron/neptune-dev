import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
// import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge';
import AddAutoNC from './AddAutoNC';
import AddAutoSH from './AddAutoSH';

const RapidCard = ({ 
  batchId, batchNum, groupId, 
  hasSeries, srsQ, allQ, flows,
  ncTypesCombo, vassembly, user
})=> {

  const [ typeState, typeSet ] = useState(false);
  const [ applyState, applySet ] = useState(false);
  
  const [ nonConsState, nonConsSet ] = useState([]);

  const [ shortState, shortSet ] = useState([]);
  
  useEffect( ()=> {
    if(applyState === true) {
      this.quant.value = hasSeries ? srsQ : allQ;
    }else{
      this.quant.value = 0;
    }
  }, [applyState]);
  
  function save(e) {
    e.preventDefault();
    
    const rType = this.rType.value.trim().toLowerCase();
    const issueNum = this.issNum.value.trim().toLowerCase();
    
    const exTime = this.hourNum.value;
    
    const endDate = this.eDate.value;
    const doneTarget = moment(endDate).endOf('day').format();
    
    const flowKey = this.flowKey ? this.flowKey.value : false;
    
    let falls = [];
    this.doBuild && this.doBuild.checked ? falls.push('doBuild') : null;
    this.doInspect && this.doInspect.checked ? falls.push('doInspect') : null;
    this.doTest && this.doTest.checked ? falls.push('doTest') : null;
    this.doFinish && this.doFinish.checked ? falls.push('doFinish') : null;

    const howText = this.howLink.value.trim();
    const howLink = howText.length === 0 ? false : howText;
    
    const applyAll = this.applyAll.checked;
    const quant = this.quant.value.trim().toLowerCase();
    
    const nonConArr = nonConsState || [];
    const shortArr = shortState || [];
    
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
          selfclose();
        }else{
          toast.warning('Duplicate');
        }
    });
  }
  
  
  return(
    <div className='balancer'>
      <div>
        <div className='centre vmargin'>
        
          <label htmlFor='rType'>Extend Type<br />
            <select
              id='rType'
              onChange={(e)=>typeSet(e.target.value)}
              required>
                <option></option>
                <option value='repair'>Repair</option>
                <option value='refurbish'>Refurbish</option>
                <option value='modify'>Modify</option>
            </select>
          </label>
        
          <label htmlFor='issNum' className='breath'>Issue number <em>(RMA, Sales, etc)</em><br />
          <input
            type='text'
            id='issNum'
            maxLength='32'
            minLength='3'
            required
          /></label>
      
        </div>
      
        <div className='centre vmargin'>
          <label htmlFor='hourNum' className='breath'>{Pref.timeBudget} <em>(in hours)</em><br />
          <input
            type='number'
            id='hourNum'
            className='numberSet indenText'
            pattern="^\d*(\.\d{0,2})?$"
            maxLength='6'
            minLength='1'
            max='500'
            min='0'
            step=".05"
            inputMode='numeric'
            placeholder='12.03'
            defaultValue={0}
            required
          /></label>
        </div>
      
        <div className='centre vmargin'>
          <label htmlFor='eDate' className='breath'>Delivery Goal<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required
          /></label>
        </div>
      
        <div className='vmargin'>
          <label htmlFor='quant' className='breath'>Quantity<br />
          <input
            type='number'
            id='quant'
            pattern='[00000-99999]*'
            min={0}
            max={allQ}
            placeholder={allQ}
            disabled={applyState}
            required 
          /></label>
        
          <label className='breath'><br />
            <label htmlFor='applyAll' className='beside'>
            <input
              type='checkbox'
              id='applyAll'
              className='indenText inlineCheckbox'
              onChange={(e)=>applySet(e.target.checked)}
              defaultChecked={false}
            />Apply to All</label>
          </label>
        </div>
        
        <div className='centreRow vmargin'>
        
          <label htmlFor='howLink' className='breath'>Alternative Instruction<br />
          <input
            type='url'
            id='howLink'
            placeholder="http://"
          /></label>
          
        </div>
      
      </div>
      
      <div className='vmargin'>
        
        {hasSeries ?
          
          <div className='centre'>

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
        
            <div className='vmargin'>
              <AddAutoNC
                ncTypesCombo={ncTypesCombo}
                user={user}
                nonConsState={nonConsState}
                nonConsSet={nonConsSet}
                lockOut={!typeState || typeState === 'modify'}
              />
              <ol className='indenText'>
                {hasSeries && nonConsState.map( (entry, index)=>(
                    <li key={index}>{entry.ref} | {entry.type}</li>
                ))}
              </ol>
            </div>
          
            <div className='vmargin'>
              <AddAutoSH
                vassembly={vassembly}
                shortState={shortState}
                shortSet={shortSet}
                lockOut={!typeState || typeState === 'modify'}
              />
              <ol className='indenText'>
                {hasSeries && shortState.map( (entry, index)=>(
                  <li key={index}>{entry.refs} | {entry.part}</li>
                ))}
              </ol>
            </div>
          </div>
          
          :
          
          <div className='fitWide'>
            <label className='breath'><br />
              <label htmlFor='doBuild' className='beside'>
              <input
                type='checkbox'
                id='doBuild'
                className='indenText inlineCheckbox'
                defaultChecked={false}
              />Count Do {typeState}</label>
            </label>
            
            <label className='breath'><br />
              <label htmlFor='doInspect' className='beside'>
              <input
                type='checkbox'
                id='doInspect'
                className='indenText inlineCheckbox'
                defaultChecked={false}
              />Count Inspections</label>
            </label>
            
            <label className='breath'><br />
              <label htmlFor='doTest' className='beside'>
              <input
                type='checkbox'
                id='doTest'
                className='indenText inlineCheckbox'
                defaultChecked={false}
              />Count Testing</label>
            </label>
            
            <label className='breath'><br />
              <label htmlFor='doFinish' className='beside'>
              <input
                type='checkbox'
                id='doFinish'
                className='indenText inlineCheckbox'
                defaultChecked={false}
              />Count Finshing</label>
            </label>
          </div>
        }
        
        
      
      </div>
    </div>
  );
};

export default RapidCard;