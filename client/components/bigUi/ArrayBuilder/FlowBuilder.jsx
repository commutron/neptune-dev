import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import './style.css';

import { branchOptions, FinishOptions } from './FlowElements';

import { branchesOpenSort } from '/client/utility/Arrays';

const FlowBuilder = ({ app, options, imods, defaultEnd, baseline, onClick })=> {

  const [ branchSelect, branchSet ] = useState(false);
  const [ steps, stepsSet ] = useState( [] );
  
  const [ endState, endSet ] = useState( defaultEnd );
  
  const [ toggle, toggleChange ] = useState( false );
  
  const brancheS = branchesOpenSort(app.branches, true);
  
  useEffect( ()=>{
    if(baseline) {
      let baseSet = new Set();
      for(let t of baseline) {
        let o = options.find(x => x.key === t.key);
        o ? o['how'] = t.how : null;
        o ? baseSet.add(o) : null;
      }
      stepsSet( [...baseSet] );
    }else{null}
  }, []);
  
  function sendUp() {
    // steps set from state
    let list = new Set( steps );
    // add the finish step back on the end
    list.add(endState);
    // update state
    stepsSet( [...list] );
    // Unlock save button
    onClick([...list]);
  }
  
  function changeEnding(e) {
    const endVal = this.endTrkStep.value;
    let endObj = defaultEnd;
    endObj.step = endVal;
    endSet(endObj);
  }

  function addStep(e) {
    e.preventDefault();
    let list = new Set( steps ); // steps set from state
    const sk = this.rStep.value;
    const hw = this.rHow.value; 
    const step = options.find( x => x.key === sk ); // the step object
   
    // set how key in the track object
    step['how'] = hw;
    // take off the end finish step
    list.delete(endState);
    // add step to list
    list.add(step);
    // update state with the new list
    stepsSet( [...list] );
    // clear form
    this.rStep.value = '';
    // lock save button
    onClick(false);
  }

  function removeOne(entry) {
    const curr = new Set( steps );
    const nope = entry;
    // take of the end finish step
    curr.delete(endState);
    // take off selected step
    curr.delete(nope);
    // update state
    stepsSet( [...curr] );
    // lock save button
    onClick(false);
  }
  
  function moveUp(obj, indx) {
    let newList = steps;
    if(indx === 0) {
      null;
    }else{
      newList.splice(indx, 1);
      newList.splice(indx - 1, 0, obj);
    }
    stepsSet( newList );
    toggleChange(!toggle);
    // lock save button
    onClick(false);
  }
  
  function moveDown(obj, indx) {
    let newList = steps;
    if(indx === newList.length - 1) {
      null;
    }else{
      newList.splice(indx, 1);
      newList.splice(indx + 1, 0, obj);
    }
    stepsSet( newList );
    toggleChange(!toggle);
    // lock save button
    onClick(false);
  }
    
  function clear() {
    stepsSet( [] );
    // lock save button
    onClick(false);
  }
  
  const lockout = steps.filter( 
                    y => Object.values( y )
                      .includes( 'f1n15h1t3m5t3p' ) )
                        .length > 0;
  
  const branchOps = branchOptions(branchSelect, options);
  
  return(
    <div className='min750'>
      <div className='space1v rightText'>
        <p className='nomargin'>
          <label htmlFor='phasefltr' className='cap'>{Pref.branch}<br />
            <select 
              id='phasefltr'
              className='cap'
              onChange={(e)=>branchSet( e.target.value )} 
              required>
              <option value={false}></option>
              {brancheS.map( (entry, index)=>{
                return( 
                  <option 
                    key={index+'br'} 
                    value={entry.brKey}
                  >{entry.branch}</option>
              )})}
            </select>
          </label>
        </p>
        <form onSubmit={(e)=>addStep(e)}>
          <p className='nomargin'>
            <label 
              htmlFor='rStep' 
              className=''
            >Tracking Step<br />
              <select id='rStep' className='cap' required>
                <option value=''></option>
                {branchOps.map( (entry, index)=>{
                  return( 
                    <option 
                      key={index} 
                      value={entry.key}
                      >{entry.step + ' - ' + entry.type}
                    </option> 
                )})}
              </select>
            </label>
          </p>
          <p className='nomargin'>
            <label 
              htmlFor='rHow' 
              className=''
            >{Pref.instruct} anchor<br />
              <input 
                id='rHow'
                type='text'
                list='imoduleList'
                placeholder='optional'
                className='dbbleWide' /> 
              <button
                type='submit' 
                className='smallAction blackHover'
              >Add</button>
            </label>
            <datalist id="imoduleList">
              {imods.map( (m,mx)=> <option key={mx}>{m}</option> )}
            </datalist>
          </p>
        </form>
      </div>
      <div className='wide space1v'>
        <div className='stepList'>
          {steps.map( (entry, index)=> {
          const branch = app.branches.find( x => x.brKey === entry.branchKey );
          const niceBr =  branch ? branch.branch : '';
          return(                 
            <div key={index}>
              <div>{entry.step}</div>
              <div>{entry.type}</div>
              <div className='cap'>{niceBr}</div>
              <div className='wordBr'>{entry.how}</div>
              <div>
                <OrderButton 
                  id='up'
                  name='Move Up'
                  icon='fa-arrow-up' 
                  clFunc={()=>moveUp(entry, index)}
                  disabled={lockout || index === 0}
                />
                <OrderButton 
                  id='dn'
                  name='Move Down'
                  icon='fa-arrow-down' 
                  clFunc={()=>moveDown(entry, index)}
                  disabled={lockout || index === steps.length - 1}
                />
                <OrderButton 
                  id='ex'
                  name='Remove'
                  color='redHover'
                  icon='fa-times' 
                  clFunc={()=>removeOne(entry)}
                  disabled={lockout && entry.key !== 'f1n15h1t3m5t3p'}
                />
              </div>
            </div>
          )})}
        </div>
        <div className='comfort vmarginhalf'>
          <button
            className='smallAction redHover up'
            onClick={(e)=>clear(e)}
            disabled={steps.length === 0}
          >clear all</button>
          <span>
            <select
              id='endTrkStep'
              className='miniIn12'
              defaultValue={defaultEnd.step}
              onChange={(e)=>changeEnding(e)}
              required
            >
              <FinishOptions />
            </select>
            <button
              className='smallAction greenHover up'
              disabled={false}
              onClick={(e)=>sendUp(e)}>Finish {Pref.flow}</button>
          </span>
        </div>
        <small>
          Adding the Finish Step locks reordering. Remove the Finish Step to continue editing.
        </small>
      </div>
    </div>
  );
};

export default FlowBuilder;

const OrderButton = ({ id, name, color, icon, clFunc, disabled })=> (
  <button
    type='button'
    name={name}
    id={id}
    className={`smallAction ${color || 'blackHover'}`}
    onClick={clFunc}
    disabled={disabled}
  ><i className={`fa-solid ${icon}`}></i></button>
);