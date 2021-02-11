import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';


import ZpassScan from '/client/components/forms/ZpassScan';



const BehaviorSlide = ({app})=> {
  
  const rndmKey2 = Math.random().toString(36).substr(2, 5);
  
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
    <div className='space3v autoFlex'>
      
      
      <ZpassScan />
      
      
      
      <div>
        <h2><i className='fas fa-flag-checkered fa-fw'></i> Default Finish Step</h2>
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
      
      <div>
        <h2><i className='fas fa-unlock fa-fw'></i> River Locking</h2>
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
      
      <FirstRepeat app={app} />
      
      <IndirectSteps app={app} />
      
      <AlterReason app={app} />
      
    </div>
  );
};

export default BehaviorSlide;


const FirstRepeat = ({ app })=> {
  
  function reptRemove(key, reason) {
    toast.info('This may take a moment');
    Meteor.call('removeRepeatOption', key, reason, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('entry removed');
      }else{
        toast.warning('Cannot be removed, entry is in use');
      }
    });
  }
  function reptDormant(key, live) {
    const make = !live;
    Meteor.call('dormantRepeatOption', key, make, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('entry de-activated');
      }else{
        toast.warning('Cannot be de-activated, entry is in use');
      }
    });
  }
  
  return(
    <div>
      <h2>First-Off / Verify Repeat</h2>
      <p>Options for reason of a repeated first-off or verify</p>
      <em>a new smarter, keyed collection</em>
      <AppSetSimple title='Repeat Reason' action='addRepeatOption' rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.repeatOption && app.repeatOption.map( (entry)=>{
          return( 
            <li key={entry.key}>
              <i className={entry.live ? '' : 'fade'}>{entry.reason}</i>
              <button 
                className='miniAction redT'
                onClick={()=>reptRemove(entry.key, entry.reason)}
              ><i className='fas fa-times fa-fw'></i></button>
              <button 
                className='miniAction redT'
                onClick={()=>reptDormant(entry.key, entry.live)}
              ><i className='fas fa-power-off fa-fw'></i></button>
            </li>
        )})}
      </ol>
    </div>
  );
};

const IndirectSteps = ({ app })=> {
  
  function ancRemove(name) {
    toast.info('This may take a moment');
    Meteor.call('removeAncOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Cannot be removed, entry is in use');
      }
    });
  }
  
  return(
    <div>
      <h2 className='cap'>{Pref.ancillary} steps</h2>
      <i>Not strictly assembly but part of the total proccess. Not tracked</i>
      <AppSetSimple
        title='step'
        action='addAncOp'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ul>
        {app.ancillaryOption.map( (entry, index)=>{
          return( 
            <li key={index}>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={()=>ancRemove(entry)}
              ><i className='fas fa-times fa-fw'></i></button>
            </li>
        )})}
      </ul>
    </div>
  );
};

const AlterReason = ({ app })=> {
  
  function altrRemove(reason) {
    Meteor.call('removeAlterFulfillOption', reason, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Entry removed');
      }else{
        toast.warning('Cannot be removed');
      }
    });
  }
  
  return(
    <div>
      <h2>Alter {Pref.end}</h2>
      <p>Options for reason of altering a {Pref.end}</p>
      <AppSetSimple title='Alter Reason' action='addAlterFulfillOption' rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ol>
        {app.alterFulfillReasons && app.alterFulfillReasons.map( (entry, index)=>{
          return( 
            <li key={index}>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={()=>altrRemove(entry)}
              ><i className='fas fa-times fa-fw'></i></button>
            </li>
        )})}
      </ol>
    </div>
  );
};
