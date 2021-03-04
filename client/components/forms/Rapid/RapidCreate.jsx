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
    color='darkOrangeT'
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
  const [ noLimitState, noLimitSet ] = useState(false);
  
  const [ waterState, waterSet ] = useState('fall');
  
  const [ flowsState, flowsSet ] = useState(false);
  
  const [ nonConsState, nonConsSet ] = useState([]);

  const [ shortState, shortSet ] = useState([]);
  
  useEffect( ()=> {
    if(applyState) {
      noLimitSet(false);
    }
  }, [applyState]);
  
  useEffect( ()=> {
    if(noLimitState) {
      applySet(false);
    }
  }, [noLimitState]);
  
  useEffect( ()=> {
    if(applyState || noLimitState) {
      this.quant.value = hasSeries ? srsQ : allQ;
    }else{
      this.quant.value = 0;
    }
  }, [applyState, noLimitState]);
  
  function save(e) {
    e.preventDefault();

    const rType = this.rType.value;
    const issueNum = this.issNum.value.trim();
    
    const exTime = this.hourNum.value;
    
    const endDate = this.eDate.value;
    const doneTarget = moment(endDate).endOf('day').format();
    
    const howText = this.howLink.value.trim();
    const howLink = howText.length === 0 ? false : howText;
    
    const noteText = this.noteText.value.trim();
    
    const noLimit = this.noLimit.checked;
    const quant = this.quant.value.trim();
    
    const addFlow = waterState === 'both' || waterState === 'flow';
    const addFall = waterState === 'both' || waterState === 'fall';
      
    let flows = addFlow ? flowsState : false;
    
    const nonConArr = addFlow ? nonConsState : [];
    const shortArr = addFlow ? shortState : [];
    
    let falls = addFall ? [] : false;
    addFall && this.doPre.checked ? falls.push('doPre') : null;
    addFall && this.doBuild.checked ? falls.push('doBuild') : null;
    addFall && this.doInspect.checked ? falls.push('doInspect') : null;
    addFall && this.doTest.checked ? falls.push('doTest') : null;
    addFall && this.doFinish.checked ? falls.push('doFinish') : null;
    
    Meteor.call('addExtendRapid', 
      batchId, groupId, rType, batchNum, issueNum,
      exTime, doneTarget, flows, falls, howLink, noteText, noLimit, quant,
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
    <form id='createRapid' className='balancer' onSubmit={(e)=>save(e)}>
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
            disabled={applyState || noLimitState}
            required 
          /><br />
            <label htmlFor='applyAll' className='beside'
              title='Set quantity to maximum value'>
              <input
                type='checkbox'
                id='applyAll'
                className='indenText inlineCheckbox'
                onChange={(e)=>applySet(e.target.checked)}
                checked={applyState}
              />Apply to All
            </label>
            <label 
              htmlFor='noLimit' className='beside' 
              title={`No fixed quantity.\nMin: 0, Max: ${allQ}`}>
              <input
                type='checkbox'
                id='noLimit'
                className='indenText inlineCheckbox'
                onChange={(e)=>noLimitSet(e.target.checked)}
                checked={noLimitState}
              />No Limit
            </label>
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
            columns={5}
          ></textarea>
          </label>
          
        </div>
      
      </div>
      
      <div className='vmargin'>
        
        {hasSeries &&
          <div className='centreRow vmargin'>
            <label htmlFor='dofall' className='beside'>
              <input
                type='radio'
                id='dofall'
                name='watertype'
                className='indenText inlineCheckbox gap'
                onChange={()=>waterSet('fall')}
                defaultChecked={true}
              />General Counters
            </label>
            <label htmlFor='doflow' className='beside'>
              <input
                type='radio'
                id='doflow'
                name='watertype'
                className='indenText inlineCheckbox gap'
                onChange={()=>waterSet('flow')}
              />Serial Steps
            </label>
            <label 
              htmlFor='doboth' className='beside' 
              title={`No fixed quantity.\nMin: 0, Max: ${allQ}`}>
              <input
                type='radio'
                id='doboth'
                name='watertype'
                className='indenText inlineCheckbox'
                onChange={()=>waterSet('both')}
              />Both
            </label>
          </div>
        }
        
        {waterState === 'both' || waterState === 'flow' ?
          
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
        :null}
        
        {waterState === 'both' || waterState === 'fall' ?
          
          <div className='fitWide'>
            <label className='breath'><br />
              <label htmlFor='doPre' className='beside'>
              <input
                type='checkbox'
                id='doPre'
                className='indenText inlineCheckbox'
                defaultChecked={false}
              />Count Pre-Checks</label>
            </label>
            
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
        :null}
        
        <div className='vmargin centre'>
        {(waterState === 'both' || waterState === 'flow') && !flowsState ?
          <small>Must Finish Flow</small> : null}
          <button
            type='submit'
            form='createRapid'
            id='extendGo'
            className='action clear greenHover'
            disabled={waterState === 'both' || waterState === 'flow' ? !flowsState : false}
          >Create Extension</button>
        </div>
      
      </div>
    </form>
  );
};