import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import './style.css';

const BranchBuilder = ({ app, lockout })=> {
  
  const defaultBranches = app.branches || [];
  
  const [ phasesState, phasesSet ] = useState( new Set( defaultBranches ) );
  
  // useLayoutEffect( ()=>{
  // }, []);
  
  function handleSave(e) {
    const list = phasesState;
    const listAsArray = [...list];

    Meteor.call('reorderPhaseOptions', listAsArray, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('good');
      }else{
        toast.warning('no good');
      }
    });
  }

  function handleRemovePhaseOp(entry) { //removePhaseOption   canPhaseRemove
    const current = phasesState;
    const nope = entry;
    // take off selected step
    current.delete(nope);
    phasesSet( current );
    /*
    Meteor.call('removePhaseOption', name, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success(`${Pref.phase} removed`);
      }else{
        toast.warning(`Cannot remove, ${Pref.phase} is in use`);
      }
    });
    */
  }
  
  function moveUp(obj, indx) {
    let newList = [...phasesState];
    if(indx === 0) {
      null;
    }else{
      newList.splice(indx, 1);
      newList.splice(indx - 1, 0, obj);
    }
    phasesSet( new Set(newList) );
  }
  
  function moveDown(obj, indx) {
    let newList = [...phasesState];
    if(indx === newList.length - 1) {
      null;
    }else{
      newList.splice(indx, 1);
      newList.splice(indx + 1, 0, obj);
    }
    phasesSet( new Set(newList) );
  }
    

  const phasesAppArr = app.phases;
  let phasesStateArr = [...phasesState];
    
    
  return(
    <div className=''>
      <div className='stepList'>
        {phasesStateArr.map( (entry, index)=> {  
          return (                 
            <div key={index+entry}>                      
              <div>
                {entry}
              </div>
              <div>
                <button
                  type='button'
                  name='Move Up'
                  id='movePhUp'
                  className='smallAction blueHover'
                  onClick={()=>moveUp(entry, index)}
                  disabled={lockout || index === 0}
                ><i className='fas fa-arrow-up'></i></button>
                <button
                  type='button'
                  name='Move Down'
                  id='movePhDown'
                  className='smallAction blueHover'
                  onClick={()=>moveDown(entry, index)}
                  disabled={lockout || index === phasesStateArr.length - 1}
                ><i className='fas fa-arrow-down'></i></button>
                <button
                  type='button'
                  name='Remove'
                  id='removePh'
                  className='smallAction redHover'
                  onClick={()=>handleRemovePhaseOp(entry)}
                  disabled={true}
                ><i className='fas fa-times'></i></button>
              </div>
            </div>
        )})}
      </div>
      <br />
      <button
        value={phasesStateArr}
        className='smallAction clearGreen up'
        disabled={false}
        onClick={(e)=>handleSave(e)}>Save Phase List</button>
    </div>
  );
};

export default BranchBuilder;