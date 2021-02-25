import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import '/client/components/bigUi/ArrayBuilder/style.css';

const AddFlowSteps = ({ app, flowsState, flowsSet })=> {

  const [ branchSelect, branchSet ] = useState(false);
  const [ steps, stepsSet ] = useState( [] );
  
  const [ endState, endSet ] = useState( app.lastTrack );
  
  const [ toggle, toggleChange ] = useState( false );
  
  const branchesSort = app.branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  
  // useEffect( ()=>{
  //   if(baseline) {
  //     let baseSet = new Set();
  //     for(let t of baseline) {
  //       let o = options.find(x => x.key === t.key);
  //       o ? o['how'] = t.how : null;
  //       o ? baseSet.add(o) : null;
  //     }
  //     stepsSet( [...baseSet] );
  //   }else{null}
  // }, []);
  
  function sendUp() {
    // steps set from state
    let list = new Set( steps );
    // add the finish step back on the end
    list.add(endState);
    // update state
    stepsSet( [...list] );
    // Unlock save button
    flowsSet([...list]);
  }
  
  function changeEnding(e) {
    const endVal = this.endTrkStep.value;
    let endObj = app.lastTrack;
    endObj.step = endVal;
    endSet(endObj);
  }

  function addStep(e) {
    e.preventDefault();
    let list = new Set( steps ); // steps set from state
    const sk = this.rStep.value;
    const step = app.trackOption.find( x => x.key === sk ); // the step object
    
    if(step) {
      // take off the end finish step
      list.delete(endState);
      
      // add step to list
      list.add(step);
      // update state with the new list
      stepsSet( [...list] );
      
      // clear form
      this.rStep.value = '';
      flowsSet(false);
    }
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
    if(nope.type === 'finish') {
      flowsSet(false);
    }
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
  }
  
  const lockout = steps.filter( 
                    y => Object.values( y )
                      .includes( 'f1n15h1t3m5t3p' ) )
                        .length > 0;
  
  let optionsSort = app.trackOption.sort((t1, t2)=>
               t1.step < t2.step ? -1 : t1.step > t2.step ? 1 : 0 );
               
  const branchedOps = branchSelect === 'other' ?
    optionsSort.filter( x => !x.branchKey || x.branchKey === '') :
    optionsSort.filter( x => x.branchKey === branchSelect);

  return (
    <div>
      <div className='inlineForm'>
          <label htmlFor='phasefltr' className='cap'>{Pref.branch}<br />
            <select 
              id='phasefltr' 
              className='miniIn12'
              onChange={(e)=>branchSet( e.target.value )} 
              >
              <option value='other'>No Branch</option>
              {branchesSort.map( (entry, index)=>{
                return( 
                  <option 
                    key={index+'br'} 
                    value={entry.brKey}
                  >{entry.branch}</option>
              )})}
            </select>
          </label>
        
            <label 
              htmlFor='rStep' 
            >Tracking Step<br />
              <select id='rStep' className='cap'>
                <option value=''></option>
                {branchedOps.map( (entry, index)=>{
                  return ( <option key={index} value={entry.key}>{entry.step + ' - ' + entry.type}</option> );
                })}
              </select>
            </label>
          
          <label htmlFor='goAddStp'><br />
            <button
              type='button'
              id='goAddStp'
              onClick={(e)=>addStep(e)}
              className='smallAction clearBlack'
            >Add</button>
          </label>
            
          </div>
      <div className='vmarginhalf'>
        <div className='stepList'>
          {steps.map( (entry, index)=> {
          return(                 
            <div key={index}>                      
              <div>{entry.step}</div>
              <div>{entry.type}</div>
              <div>
                <button
                  type='button'
                  name='Move Up'
                  id='up'
                  className='smallAction blueHover'
                  onClick={()=>moveUp(entry, index)}
                  disabled={lockout || index === 0}
                ><i className='fas fa-arrow-up'></i></button>
                <button
                  type='button'
                  name='Move Down'
                  id='dn'
                  className='smallAction blueHover'
                  onClick={()=>moveDown(entry, index)}
                  disabled={lockout || index === steps.length - 1}
                ><i className='fas fa-arrow-down'></i></button>
                <button
                  type='button'
                  name='Remove'
                  id='ex'
                  className='smallAction redHover'
                  onClick={()=>removeOne(entry)}
                  disabled={lockout && entry.key !== 'f1n15h1t3m5t3p'}
                ><i className='fas fa-times'></i></button>
              </div>
            </div>
          )})}
        </div>
        <div className='flexRR vmarginhalf'>
          <span>
            <select
              id='endTrkStep'
              className='miniIn12'
              defaultValue={app.lastTrack.step}
              onChange={(e)=>changeEnding(e)}
              required
            >
              <option value='finish'>Finish</option>
              <option value='pack'>Pack</option>
              <option value='pack-ship'>Pack & Ship</option>
            </select>
            <button
              type='button'
              className='smallAction clearGreen up'
              disabled={false}
              onClick={(e)=>sendUp(e)}>Finish Mini Flow</button>
          </span>
        </div>
       
      </div>
    </div>
  );
};

export default AddFlowSteps;