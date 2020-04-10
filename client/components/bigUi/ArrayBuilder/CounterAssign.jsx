import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import './style.css';

import Model from '/client/components/smallUi/Model.jsx';

// props
/// id={b._id}
/// widget={w}
/// lock={!more}

const CounterAssign = ({ id, app, lock, noText, waterfall })=> {

  function handleAssign(e) {
    e.preventDefault();
    this.go.disabled = true;
    const batchID = id;
    let wfKey = this.choice.value;
    const option = app.countOption.find( x => x.key === wfKey);
    const wfGate = option ? option.gate : null;
    const wfType = option ? option.type : null;
    const wfBranch = option ? option.branchKey : null;
    if(typeof wfKey === 'string' && wfGate) {
      Meteor.call('addCounter', batchID, wfKey, wfGate, wfType, wfBranch, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
        this.go.disabled = false;
        this.choice.value = '';
      });
    }else{
      toast.warning('Cannot Save');
    }
  }
  
  function handleRemove(wfKey) {
    const batchID = id;
    Meteor.call('removeCounter', batchID, wfKey, (error, reply)=>{
      error && console.log(error);
      reply ? reply === 'inUse' ?
      toast.warning('Cannot be removed, is currently in use') :
      toast.success('Saved') : 
      toast.error('Server Error');
    });
  }

  const cOp = app.countOption || [];
    
  return (
    <Model
      button={Pref.counter + 's'}
      title={'assign ' + Pref.counter + 's'}
      color='blueT'
      icon='fa-stopwatch'
      lock={!Roles.userIsInRole(Meteor.userId(), 'run') || lock}
      noText={noText}>
      <div>
        <p className='centreText'>A process gate marks the end of one phase and the start of the next.</p>
        <p className='centreText'>A counter is a record of items, without serial numbers, passing through a gate.</p>
        <form className='centre' onSubmit={(e)=>handleAssign(e)}>
          <p>
            <select id='choice' required>
            <option></option>
            {cOp.map( (entry)=>{
              let opLock = waterfall.find( x => x.wfKey === entry.key);
              const branchObj = app.branches.find( y => y.brKey === entry.branchKey );
              const branchName = branchObj ? branchObj.branch : 'n/a';
              return(
                <option 
                  key={entry.key} 
                  value={entry.key}
                  disabled={opLock}
                >{entry.gate} - {entry.type} - {branchName}</option>
               );
            })}
            </select>
            <label htmlFor='choice'>Process Gate</label>
          </p>
          <p>
            <button
              type='submit'
              id='go'
              disabled={false}
              className='action clearGreen'
            >Add A Counter</button>
          </p>
        </form>
        <hr />
        <p className='centreText'>Saved, assigned counters.</p>
        <p className='centreText'>To preserve important data, only unstarted counters can be removed</p> 
        <div className='gateList'>
          {waterfall.map( (entry, index)=> {
            const branchObj = app.branches.find( y => y.brKey === entry.branchKey );
            const branchName = branchObj ? branchObj.branch : 'n/a';
            return (                 
              <div key={entry.wfKey}>                      
                <div>
                  {entry.gate} - {entry.type} - {branchName}
                </div>
                <div>
                  <button
                    type='button'
                    name='Remove'
                    id={'ex'+index}
                    className='smallAction redHover'
                    onClick={()=>handleRemove(entry.wfKey)}
                    disabled={entry.counts.length > 0}
                  ><i className='fas fa-times'></i></button>
                </div>
              </div>
            )})}
        </div>
      </div>
    </Model>
  );
};

export default CounterAssign;