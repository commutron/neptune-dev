import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import '/client/components/bigUi/ArrayBuilder/style.css';

import { 
  branchOptions,
  FinishOptions
} from '/client/components/bigUi/ArrayBuilder/FlowElements';

import { branchesSort } from '/client/utility/Arrays';

export const FlowStepsWrap = ({ 
  rapidData, hasSeries, rSetItems,
  editAuth, app
})=> {
  
  const [ editState, editSet ] = useState(false);
  
  const defaultFlow = rapidData ? rapidData.whitewater : [];
  
  const [ flowsState, flowsSet ] = useState(defaultFlow);
  
  function handleSave() {
      
    let flows = flowsState;
  
    Meteor.call('setExRapidFlow', rapidData._id, flows, rapidData.extendBatch,
      (error, reply)=> {
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          null;
        }else{
          toast.warning('error');
        }
    });
    editSet(false);
  }
  
  function handleClear() {
    Meteor.call('clearExRapidFlow', rapidData._id,
      (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          null;
        }else{
          toast.warning('error');
        }
    });
    editSet(false);
  }
  
  function handleCancel() {
    editSet(false);
    flowsSet(defaultFlow);
  }
  
  if(!hasSeries) { 
    return null;
  }
  
  return(
    <div className='vmargin'>
      
      <dt className='fullline'>Steps</dt>
      
      <AddFlowSteps
        rSetItems={rSetItems}
        app={app}
        flowsState={flowsState}
        flowsSet={flowsSet}
        editState={editState}
        handleClear={handleClear}
      />
      
      {editState ?
        <span className='rightRow'>
          <button
            type='button'
            className='miniAction med gap'
            onClick={()=>handleCancel()}
          ><n-fa1><i className='far fa-edit'></i></n-fa1> cancel</button>
          
          <button
            className='smallAction gap clearBlue'
            onClick={()=>handleSave()}
            disabled={
              !rapidData.live || flowsState.length === 0 || 
              flowsState[flowsState.length-1].type !== 'finish'
            }
          >Save</button>
        </span>
      :
        <span className='rightRow'>
          <button
            title={!editAuth ? Pref.norole : !rapidData.live ? 'not open' : ''}
            className='miniAction gap'
            onClick={()=>editSet(!editState)}
            disabled={!rapidData.live || !editAuth}
          ><n-fa2><i className='fas fa-edit'></i></n-fa2> edit</button>
        </span>
      }
    </div>
  );
};



const AddFlowSteps = ({ 
  rSetItems, app, 
  flowsState, flowsSet, editState, handleClear 
})=> {
  
  const dfEnd = flowsState.length > 0 && 
                flowsState[flowsState.length-1].type === 'finish' ?
                flowsState[flowsState.length-1] : app.lastTrack;
                
  const [ branchSelect, branchSet ] = useState(false);
  const [ steps, stepsSet ] = useState( [] );
  
  const [ endState, endSet ] = useState( dfEnd );
  
  const [ toggle, toggleChange ] = useState( false );
  
  useEffect( ()=>{
    stepsSet(flowsState);
    endSet(dfEnd);
  }, [editState]);
  
  const brancheS = branchesSort(app.branches);
  
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
    let endObj = dfEnd;
    endObj.step = endVal;
    endSet(endObj);
  }

  function addStep(e) {
    e.preventDefault();
    let list = new Set( steps ); // set from state
    const sk = this.rStep.value;
    const step = app.trackOption.find( x => x.key === sk ); // step object
    
    if(step) {
      // take off the end finish step
      list.delete(endState);
      // add step to list
      list.add(step);
      // update state with the new list
      stepsSet( [...list] );
      // clear form
      this.rStep.value = '';
      flowsSet([]);
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
      flowsSet([]);
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
                      .includes( 'finish' ) )
                        .length > 0;
  
  const branchOps = branchOptions(branchSelect, app.trackOption);
  
  return(
    <div>
    {editState && rSetItems > 0 ?
      <p className='trueyellow centreText'>{Pref.items} have begun this {Pref.flow}</p> : null}
    {editState &&
      <div className='inlineForm interForm'>
        <label htmlFor='phasefltr' className='cap'>{Pref.branch}<br />
          <select 
            id='phasefltr' 
            className='miniIn12 interSelect'
            onChange={(e)=>branchSet( e.target.value )} 
            >
            <option value='other'>No Branch</option>
            {brancheS.map( (entry, index)=>{
              return( 
                <option 
                  key={index+'br'} 
                  value={entry.brKey}
                >{entry.branch}</option>
            )})}
          </select>
        </label>
        
        <label htmlFor='rStep'>Tracking Step<br />
          <select id='rStep' className='cap interSelect'>
            <option value=''></option>
            {branchOps.map( (entry, index)=>{
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
    }
      <div className='vmarginhalf'>
        <div className='stepList'>
          {(editState ? steps : flowsState).map( (entry, index)=> {
          return(                 
            <div key={index}>                      
              <div>{entry.step}</div>
              <div>{entry.type}</div>
              {!editState ? <span></span> :
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
                  disabled={lockout && entry.type !== 'finish'}
                ><i className='fas fa-times'></i></button>
              </div>
              }
            </div>
          )})}
        </div>
        
      {editState &&
        <div className='flexRR vmarginhalf'>
          <span>
            <select
              id='endTrkStep'
              className='miniIn12 interSelect'
              defaultValue={dfEnd.step}
              onChange={(e)=>changeEnding(e)}
              required
            >
              <FinishOptions />
            </select>
            <button
              type='button'
              className='smallAction clearGreen'
              disabled={lockout}
              onClick={(e)=>sendUp(e)}>Finish Mini Flow</button>
          </span>
        </div>
      }
      {editState && handleClear && steps.length === 0 ?
        <span className='rightRow'>
          <button
            className='miniAction gap blueLineHover'
            onClick={()=>handleClear()}
          >Save Empty Flow</button>
        </span>
      : null}
      </div>
    </div>
  );
};

export default AddFlowSteps;