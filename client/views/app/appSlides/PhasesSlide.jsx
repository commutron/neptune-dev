import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';

import ArrayBuilder from '/client/components/bigUi/ArrayBuilder/PhaseBuilder.jsx';

const PhasesSlide = ({app})=> {
  
  const rndmKey1 = Math.random().toString(36).substr(2, 5);
  const rndmKey2 = Math.random().toString(36).substr(2, 5);
  
  function removePhaseOp(e, name) {
    Meteor.call('removePhaseOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success(`${Pref.phase} removed`);
      }else{
        toast.warning(`Cannot remove, ${Pref.phase} is in use`);
      }
    });
  }
  
  function endTrack(e) {
    e.preventDefault();
    const lastS = this[rndmKey2 + 'dnTrkStep'].value;
    const lastH = this[rndmKey2 + 'dnTrkHow'].value;
    Meteor.call('endTrack', lastS, lastH, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.danger('Server Error');
      }
    });
  }
  
  function handleLocking() {
    const type = this[rndmKey2 + 'trkCntrl'].value;
    Meteor.call('setLockType', type, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.danger('Server Error');
      }
    });
  }
  
  let lt = app.lastTrack;
  let dfStep = lt.step;
  let dfHow = lt.how;
  
  return (
    <div className='invert'>
      
      <h2 className='cap'><i className='fas fa-route fa-fw'></i> {Pref.phases}</h2>
      <p>Options for Phase / Department / Tracking Catagory</p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
      
      <hr />
      
      <ArrayBuilder app={app} />
      
      <hr />
      
      <AppSetSimple
        title={Pref.phase}
        action='addPhaseOption'
        rndmKey={rndmKey1} />
      <ol>
        {app.phases.map( (entry, index)=>{
          return( 
            <li key={rndmKey1 + index + entry.key}>
              <i>{entry}</i>
              {entry !== 'finish' &&
                <button 
                  className='miniAction redT'
                  onClick={(e)=>removePhaseOp(e, entry)}
                ><i className='fas fa-times fa-fw'></i></button>}
            </li>
        )})}
      </ol>

      
      <h2><i className='fas fa-flag-checkered fa-fw'></i> Finish Step</h2>
      <div>
      
        <i>the step that marks a {Pref.item} as finished</i>
        <label htmlFor={rndmKey2 + 'dnTrk'}><br />
          <form onSubmit={(e)=>endTrack(e)} className='inlineForm'>
            <select
              id={rndmKey2 + 'dnTrkStep'}
              defaultValue={dfStep}
              required
            >
              <option value='finish'>Finish</option>
              <option value='pack'>Pack</option>
              <option value='pack-ship'>Pack & Ship</option>
            </select>
            <input 
              id={rndmKey2 + 'dnTrkHow'}
              type='text'
              defaultValue={dfHow} />
            <button type='submit' className='action clearGreen'
            >Save</button>
          </form>
        </label>
      
      </div>
      
      
      <hr />
      
      <h2><i className='fas fa-unlock fa-fw'></i> River Locking</h2>
      <div>
      
        <i>the type of lock-unlock behavior of river</i>
        <label htmlFor={rndmKey2 + 'trkCntrl'}><br />
          <select
            id={rndmKey2 + 'trkCntrl'}
            onChange={(e)=>handleLocking(e)}
            defaultValue={app.lockType}
            required
          >
            <option value={false}></option>
            <option value='timer'>Timer Only</option>
            <option value='timerVar'>Timer with Variable Speed</option>
            <option value='confirm'>Confirm from Server</option>
            <option value='confirmVar'>Confirm from Server with Variable Speed</option>
          </select>
        </label>
      
      </div>
      
    </div>
  );
};

export default PhasesSlide;