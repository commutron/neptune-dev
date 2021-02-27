import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
// import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge';
import AddFlowSteps from './AddFlowSteps';
import AddAutoNC from './AddAutoNC';
import AddAutoSH from './AddAutoSH';

const RapidCreate = ({ 
  batchId, batchNum, groupId, hasSeries, srsQ, allQ,
  flows, user, ncTypesCombo, vassembly,
  app, lock
})=> (
  <ModelLarge
    button={'Extend'}
    title={'Extend ' + Pref.xBatch}
    color='orangeT'
    icon='fa-sitemap'
    lock={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa']) || lock}>
    
    <RapidCreateForm
      groupId={groupId}
      batchId={batchId}
      batchNum={batchNum}
      hasSeries={hasSeries}
      srsQ={srsQ}
      allQ={allQ}
      flows={flows}
      ncTypesCombo={ncTypesCombo}
      vassembly={vassembly}
      user={user}
      app={app}
    />
  </ModelLarge>
);

export default RapidCreate;

const RapidCreateForm = ({ 
  batchId, batchNum, groupId, 
  hasSeries, srsQ, allQ, flows,
  ncTypesCombo, vassembly, user, app, selfclose
})=> {

  const [ typeState, typeSet ] = useState(false);
  const [ applyState, applySet ] = useState(false);
  
  const [ flowsState, flowsSet ] = useState(false);
  
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
    
    const rType = this.rType.value;
    const issueNum = this.issNum.value.trim();
    
    const exTime = this.hourNum.value;
    
    const endDate = this.eDate.value;
    const doneTarget = moment(endDate).endOf('day').format();
    
    let flows = hasSeries ? flowsState : false;
    
    let falls = [];
    this.doBuild && this.doBuild.checked ? falls.push('doBuild') : null;
    this.doInspect && this.doInspect.checked ? falls.push('doInspect') : null;
    this.doTest && this.doTest.checked ? falls.push('doTest') : null;
    this.doFinish && this.doFinish.checked ? falls.push('doFinish') : null;

    const howText = this.howLink.value.trim();
    const howLink = howText.length === 0 ? false : howText;
    
    const noteText = this.noteText.value.trim();
    
    const applyAll = this.applyAll.checked;
    const quant = this.quant.value.trim();
    
    const nonConArr = nonConsState || [];
    const shortArr = shortState || [];
    
    Meteor.call('addExtendRapid', 
      batchId, groupId, rType, batchNum, issueNum,
      exTime, doneTarget, flows, falls, howLink, noteText, applyAll, quant,
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
    <form className='balancer' onSubmit={(e)=>save(e)}>
      <div>
        <div className='centre vmargin'>
        
          <label htmlFor='rType'>Extend Type<br />
            <select
              id='rType'
              onChange={(e)=>typeSet(e.target.value)}
              required>
                <option></option>
                <option value='warranty-repair'>Warranty Repair</option>
                <option value='out-of-warranty-repair'>Out-of-Warranty-Repair</option>
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
          <label htmlFor='hourNum' className='breath'>Add to {Pref.timeBudget} <em>(in hours)</em><br />
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
      
        <div className='centre vmargin'>
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
          /><br />
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
        
        <div className='centreRow vmargin'>  
          
          <label htmlFor='noteText' className='breath'>Notes<br />
          <textarea
            id='noteText'
            rows={1}
            columns={10}
          ></textarea>
          </label>
          
        </div>
      
      </div>
      
      <div className='vmargin'>
        
        {hasSeries ?
          
          <div className='centre'>
            
            <div className='vmargin'>
              <AddFlowSteps
                app={app}
                user={user}
                flowsState={flowsState}
                flowsSet={flowsSet}
                lockOut={!typeState}
              />
            </div>
            
            <div className='vmargin'>
              <AddAutoNC
                ncTypesCombo={ncTypesCombo}
                user={user}
                nonConsState={nonConsState}
                nonConsSet={nonConsSet}
                lockOut={!typeState || typeState === 'modify'}
              />
            </div>
          
            <div className='vmargin'>
              <AddAutoSH
                vassembly={vassembly}
                shortState={shortState}
                shortSet={shortSet}
                lockOut={!typeState || typeState === 'modify'}
              />
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
        
        <div className='dropCeiling centre'>
          <button
            type='submit'
            className='action clear greenHover'
            disabled={hasSeries ? !flowsState : false}
          >Create</button>
        </div>
      
      </div>
    </form>
  );
};