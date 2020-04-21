import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import MultiSelect from "react-multi-select-component";
//import RoleCheck from '/client/components/utilities/RoleCheck.js';
import UserNice from '../smallUi/UserNice.jsx';

const FirstForm = ({ 
  id, barcode, 
  sKey, step, 
  flowFirsts,
  brancheS, branchObj,
  optionVerify, changeVerify,
  app, users, methods
})=> {

  // const [ refreshState, refreshSet ] = useState(0);
  
  const [ stepKeyState, stepKeySet ] = useState(false);
  const [ stepNameState, stepNameSet ] = useState(false);
  const [ stepBRkeyState, stepBRkeySet ] = useState(false);
  
  const [ changesState, changesSet ] = useState( "" );
  const [ howIState, howISet ] = useState(false);
  
  const [ whoBState, whoBSet ] = useState( [] );
  const [ howBState, howBSet ] = useState( [] );
  
  const [ goodState, goodSet ] = useState(true);
  const [ ngState, ngSet ] = useState(false);
  
  useEffect( ()=>{
    console.log(howBState);
    
  }, [howBState]);
  
  function setStep() {
    const stepKey = this.repeatStep.value;
    const stepObj = flowFirsts.find( x => x.key === stepKey );
    if(!stepKey) {
      null;
    }else{
      stepKeySet( stepKey );
      stepNameSet( stepObj.step );
      stepBRkeySet( stepObj.branchKey );
      !stepObj.step.toLowerCase().includes('smt') ? 
        null : howISet( 'auto' );
    }
  }
  
  function setChanges() {
    !this.change.value ? null :
    changesSet( this.change.value.trim().toLowerCase() );
  }
  
  function auto() {
    howISet( 'auto' );
  }
  function eyes() {
    howISet( 'manual' );
  }

// step 3
  function flaw() {
    let val = this.issue.value.trim().toLowerCase();
    if(!val) {
      null;
    }else{
      ngSet( val );
    }
  }
  
  function notgood() {
    this.goBad.disabled = true;
    goodSet( false );
    pass();
  }
  
  function pass() {
    this.go.disabled = true;
    
    const stepKey = !optionVerify ? sKey : stepKeyState;
		const stepName = !optionVerify ? step : stepNameState;
      
    const howI = howIState ? howIState : 'manual';
    const whoB = Array.from(whoBState, u => u.value);
    
    const howB = Array.from(howBState, u => u.value);
    const good = goodState;
    const diff = changesState;
    const ng = ngState;
    
    const fresh = optionVerify || !sKey ? false : true;
    
		Meteor.call('addFirst', 
		  id, barcode, stepKey, stepName, 
		  good, whoB, howB, howI, 
		  diff, ng, fresh, 
		(error, reply)=>{
		  error && console.log(error);
		  if(reply) {
		    document.getElementById('lookup').focus();
     	  changeVerify();
			 }else{
			   toast.error('Blocked by Server');
			 }
		});
	}
    
  let secondOpinion = true;//whoBState.has(Meteor.userId()) ? true : false;
  
  // const stepKey = optionVerify ? stepKeyState : sKey;
  const stepName = optionVerify ? stepNameState : step;
  
  const userCombo = Array.from(users, x => { return {
                                              label: x.username,
                                              value: x._id } } );
  
  
  const stepBranch = branchObj ? branchObj : 
    brancheS.find( b => b.brKey === stepBRkeyState );
    
  const buildMethods = branchObj ? branchObj.buildMethods : 
                                   stepBranch ? 
                                    stepBranch.buildMethods : [];
  
  console.log(buildMethods);
  const buildCombo = Array.from(buildMethods, x => { return {
                                              label: x,
                                              value: x } } );
  console.log(buildCombo);                                            
                                              
  return(
    <div className='vspace noCopy stoneFrame'>
      <div className='actionBox blue'>
      	<div className='flexRR'>
        	<button
        		className='action clear'
        		onClick={()=>changeVerify(false)}>
        		{Pref.close}
        	</button>
      	</div>
    		<p className='bigger centreText up'>
    		  {optionVerify ? 'Repeat' : step ? step : ''}</p>
    		<br />
        {optionVerify || !sKey ?
          <fieldset className='stoneForm'>
            <p>
              <select
                id='repeatStep'
                className='cap'
                onChange={(e)=>setStep(e)}
                defaultValue={stepKeyState}
                required>
                <option></option>
                {flowFirsts.map( (dt)=>{
                  return (
                    <option key={dt.key} value={dt.key}>{dt.step}</option>
                )})}
            </select>
              <label htmlFor='repeatStep'>Repeat First-off</label>
            </p>
            <p>
              <datalist id='commonReasons'>
                {app.repeatOption.map( (entry)=>{
                  if(entry.live === true) {
                    return( 
                      <option key={entry.key} value={entry.reason}>{entry.reason}</option> 
                )}})}
              </datalist>
              <input
        		    type='text'
        		    id='change'
        		    list='commonReasons'
        		    onChange={(e)=>setChanges(e)}
        		    defaultValue={changesState} />
              <label htmlFor='change'>Process Changes</label>
            </p>
          </fieldset>
        : null }
    
        {stepName && stepName.toLowerCase().includes('smt') ?
          <fieldset className='stoneForm'>
            <p>
              <span className='centreRow'>
                <input
                  id='manualInspect'
                  type='radio'
                  name='howInspect'
                  onChange={()=>eyes()}
                  required />
                <label htmlFor='manualInspect' className='roundActionIcon dbblRound onblueHover'>
                  <i className="fas fa-eye fa-3x"></i>
                  <br /><i className='medBig'>Manual</i>
                </label>
                <input
                  id='aoiInspect'
                  type='radio'
                  name='howInspect'
                  onChange={()=>auto()} />
                <label htmlFor='aoiInspect' className='roundActionIcon dbblRound onblueHover'>
                  <i className="fas fa-camera fa-3x"></i>
                  <br /><i className='medBig'>AOI</i>
                </label>
              </span>
            </p>
          </fieldset>
        : null}


        <div className='stoneForm fakeFielset'>
          <label htmlFor='Builder'>
            <MultiSelect
              options={userCombo}
              value={whoBState}
              onChange={whoBSet}
              labelledBy={"Builder"}
              hasSelectAll={false}
              disableSearch={true}
          /><br />{Pref.builder}</label>
        </div>  
         
      
        <div className='stoneForm fakeFielset'>
          <label htmlFor='Method'>
            <MultiSelect
              options={buildCombo}
              value={howBState}
              onChange={howBSet}
              labelledBy={"Method"}
              hasSelectAll={false}
              disableSearch={true}
          />{Pref.method}</label>
        </div>
        
  
        <fieldset 
          className='stoneForm' 
          //disabled={whoBState.size === 0 || howBState === false}
        >
          <p>
            <span className='balance'>
              <button
                type='button'
                title='No Good, repeat First-Off'
                className='roundActionIcon dbblRound firstBad'
                id='goBad'
                disabled={false}
                onClick={(e)=>notgood(e)}>
                <i className="fas fa-times fa-4x"></i>
              </button>
              <button
                type='button'
                title='OK First-Off, continue process'
                className='roundActionIcon dbblRound firstBetter'
                id='go'
                disabled={secondOpinion}
                onClick={(e)=>pass(e)}>
                <i className="fas fa-check fa-4x"></i>
              </button>
            </span>
          </p>
          <p>
            <textarea
    			    type='text'
    			    id='issue'
    			    onChange={(e)=>flaw(e)}>
    			  </textarea>
    			  <label htmlFor='issue'>{Pref.outIssue}</label>
    			</p>
    		</fieldset>
        <br />
      </div>
    </div>
  );
};

export default FirstForm;