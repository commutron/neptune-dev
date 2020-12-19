import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import './style.css';

const FlowBuilder = ({ app, options, end, baseline, onClick })=> {

  const [ branchSelect, branchSet ] = useState(false);
  const [ steps, stepsSet ] = useState( [] );
  
  const [ toggle, toggleChange ] = useState( false );
  
  const branchesSort = app.branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
  
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
    list.add(end);
    // update state
    stepsSet( [...list] );
    // Unlock save button
    onClick([...list]);
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
    list.delete(end);
    
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
    curr.delete(end);
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
    toggleChange(!toggle); // rerender
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
    toggleChange(!toggle); // rerender
    // lock save button
    onClick(false);
  }
    
  function clear() {
    stepsSetSet( [] );
    // lock save button
    onClick(false);
  }
  
  const lockout = steps.filter( 
                    y => Object.values( y )
                      .includes( 'f1n15h1t3m5t3p' ) )
                        .length > 0;
  
  let optionsSort = options.sort((t1, t2)=> {
                    if (t1.step < t2.step) { return -1 }
                    if (t1.step > t2.step) { return 1 }
                    return 0;
                  });
  const branchedOps = branchSelect === 'other' ?
    optionsSort.filter( x => !x.branchKey || x.branchKey === '') :
    optionsSort.filter( x => x.branchKey === branchSelect);

  return (
    <div className=''>
      <div className='space'>
        <p>
          <label htmlFor='phasefltr'>{Pref.Branch}<br />
            <select 
              id='phasefltr' 
              onChange={(e)=>branchSet( e.target.value )} 
              className='cap'
              required>
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
        </p>
        <form onSubmit={(e)=>addStep(e)}>
          <p>
            <label 
              htmlFor='rStep' 
              className=''
            >Tracking Step<br />
              <select id='rStep' className='cap' required>
                <option value=''></option>
                {branchedOps.map( (entry, index)=>{
                  return ( <option key={index} value={entry.key}>{entry.step + ' - ' + entry.type}</option> );
                })}
              </select>
            </label>
          </p>
          <p>
            <label 
              htmlFor='rHow' 
              className=''
            >{Pref.instruct} anchor<br />
              <input 
                id='rHow'
                type='text'
                className='dbbleWide' /> 
              <button
                type='submit' 
                className='smallAction clearWhite'
              >Add</button>
            </label>
          </p>
        </form>
      </div>
      <div className='wide'>
        <div className='stepList'>
          {steps.map( (entry, index)=> {
          const branch = app.branches.find( x => x.brKey === entry.branchKey );
          const niceBr =  branch ? branch.branch : '';
          return(                 
            <div key={index}>                      
              <div>
                {entry.step}
              </div>
              <div>
                {entry.type}
              </div>
              <div>
                {niceBr}
              </div>
              <div>
                {entry.how}
              </div>
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
        <br />
        <button
          className='smallAction clearWhite up'
          onClick={(e)=>clear(e)}
          disabled={steps.length === 0}>clear</button>
        <button
          // value={steps}
          className='smallAction clearGreen up'
          disabled={false}
          onClick={(e)=>sendUp(e)}>Set {Pref.flow}</button>
        <br />
        <p>
          The Finish Step is added and reordering is locked once the process flow is set.
          Remove the Finish Step to continue editing.
        </p>
      </div>
    </div>
  );
};

export default FlowBuilder;