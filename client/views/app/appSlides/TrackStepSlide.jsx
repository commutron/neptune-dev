import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import TrackStepEdit from '/client/components/forms/TrackStepEdit.jsx';

const TrackStepSlide = ({app, sorted})=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);
  
  function addTrackOp(e) {
    e.preventDefault();
    
    let newOp = this[rndmKey + 'input'].value.trim();
    let type = this[rndmKey + 'type'].value.trim();
    let phase = this[rndmKey + 'phase'].value.trim();
    
    Meteor.call('addTrackStepOption', newOp, type, phase, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        this[rndmKey + 'input'].value = '';
        this[rndmKey + 'type'].value = '';
        this[rndmKey + 'phase'].value = '';
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  return (
    <div className='invert'>
      
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i>{` Changing a step's ${Pref.phase} only affects the step for the future.`}</i>
        <i>{` It does not affect current ${Pref.flow}s.`}</i>
        <i>{` ${Pref.flow}s. will update when re-saved`}</i>
      </p>
          
      <h2 className='cap'>{Pref.trackProcess} Steps</h2>
      <i>Options for tracked and controlled steps</i>
      <form onSubmit={(e)=>addTrackOp(e)} className='inlineForm'>
        <label htmlFor={rndmKey + 'form'}>step<br />
          <input
            type='text'
            id={rndmKey + 'input'}
            required
          />
        </label>
        <label htmlFor={rndmKey + 'type'}>Type<br />
          <select id={rndmKey + 'type'} required >
            <option></option>
            <option value='first'>first</option>
            <option value='build'>build</option>
            <option value='inspect'>inspect</option>
            <option value='test'>test</option>
            <option value='checkpoint'>checkpoint</option>
            <option value='nest'>nest</option>
          </select>
        </label>
        <label htmlFor={rndmKey + 'type'}>{Pref.phase}<br />
          <select id={rndmKey + 'phase'} required >
            <option></option>
            {app.phases.map( (entry, index)=>{
              return( 
                <option key={index} value={entry}>{entry}</option>
            )})}
          </select>
        </label>
        <label htmlFor={rndmKey + 'add'}><br />
          <button
            type='submit'
            id={rndmKey + 'add'}
            className='smallAction clearGreen'
            disabled={false}
          >Add New</button>
        </label>
      </form>
        
      <ul>
        {sorted.map( (entry, index)=>{
          return( 
            <TrackStepEdit 
              key={rndmKey + index + entry.key} 
              app={app} 
              data={entry} />
        )})}
      </ul>
    </div>
  );
};

export default TrackStepSlide;