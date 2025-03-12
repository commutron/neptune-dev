import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import './style.css';

import ModelNative from '/client/layouts/Models/ModelNative';

const CounterAssign = ({ bID, app, waterfall, access })=> {

  function handleAssign(e) {
    e.preventDefault();
    this.cntrGo.disabled = true;

    let wfKey = this.cntrChoice.value;
    const option = app.countOption.find( x => x.key === wfKey);
    const wfGate = option ? option.gate : null;
    const wfType = option ? option.type : null;
    const wfBranch = option ? option.branchKey : null;
    
    const action = this.wfaction.value;
    
    if(typeof wfKey === 'string' && wfGate) {
      Meteor.call('addCounter', bID, wfKey, wfGate, wfType, wfBranch, action,
      (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Server Error');
        this.cntrGo.disabled = false;
        this.cntrChoice.value = '';
      });
    }else{
      toast.warning('Cannot Save');
    }
  }
  
  function handleRemove(wfKey) {
    Meteor.call('removeCounter', bID, wfKey, (error, reply)=>{
      error && console.log(error);
      reply ? reply === 'inUse' ?
      toast.warning('Cannot be removed, is currently in use') :
      toast.success('Saved') : 
      toast.error('Server Error');
    });
  }
  
  function handlePosEdit(val, wfKey) {
    Meteor.call('setCounterPosX', bID, wfKey, val, (err)=>{
      err && console.log(err);
    });
  }

  if(!access) {
    return null;
  }
  
  const cOp = app.countOption || [];
  const cOpS = cOp.sort((c1, c2)=> 
                c1.gate.toLowerCase() > c2.gate.toLowerCase() ? 1 : 
                c1.gate.toLowerCase() < c2.gate.toLowerCase() ? -1 : 0 );
  
  const waterfallS = waterfall.sort((w1, w2)=> !w1.position ? -1 : 
          w1.position > w2.position ? 1 : w1.position < w2.position ? -1 : 0 );
    
  return(
    <ModelNative
      dialogId={bID+'_counter_form'}
      title={`Assign ${Pref.counter}s`}
      icon='fa-solid fa-stopwatch'
      colorT='blueT'>
      
    <div className='overscroll'>
      <p className='centreText'>A process gate marks the end of one phase and the start of the next.</p>
      <p className='centreText'>A counter is a record of items, without serial numbers, passing through a gate.</p>
      <form className='centre' onSubmit={(e)=>handleAssign(e)}>
        <div className='rowWrap'>
          <label htmlFor='cntrChoice'>Process Gate<br />
            <select id='cntrChoice' required>
            <option></option>
            {cOpS.map( (entry)=>{
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
          </label>
          
          <label htmlFor='wfaction'>Action<br />
            <select 
              id='wfaction'
              className='miniIn16'
              required
            >
              <option value='clicker'>Count Clicker</option>
              <option value='slider'>Percent Slider</option>
            </select>
          </label>
        </div>
        <p>
          <button
            type='submit'
            id='cntrGo'
            disabled={false}
            className='action nSolid'
          >Add A Counter</button>
        </p>
      </form>
      <hr />
      <p className='centreText'>Saved, assigned counters.</p>
      <p className='centreText'>To preserve important data, only unstarted counters can be removed</p> 
      <div className='gateList'>
        <div>                      
          <div></div>
          <div>Name</div>
          <div>Type</div>
          <div>Branch</div>
          <div>Action</div>
          <div></div>
        </div>
        {waterfallS.map( (entry, index)=> {
          const branchObj = app.branches.find( y => y.brKey === entry.branchKey );
          const branchName = branchObj ? branchObj.branch : 'n/a';
          return (                 
            <div key={entry.wfKey}>
              <div>
                <input
                  type='number'
                  title='Position'
                  id={entry.wfKey+'chPos'}
                  className='tableAction narrow blackHover'
                  pattern='[0-99]*'
                  maxLength='2'
                  minLength='1'
                  max={99}
                  min={0}
                  inputMode='numeric'
                  value={entry.position || 0}
                  onChange={(e)=>handlePosEdit(e.target.value, entry.wfKey)}
                  required
                />
              </div>
              <div>{entry.gate}</div>
              <div>{entry.type}</div>
              <div>{branchName}</div>
              <div>{entry.action}</div>
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
    </ModelNative>
  );
};

export default CounterAssign;