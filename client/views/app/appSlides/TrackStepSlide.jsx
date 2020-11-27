import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import TrackStepEdit from '/client/components/forms/TrackStepEdit.jsx';

const TrackStepSlide = ({ app, branchesS, sorted })=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);
  
  function addTrackOp(e) {
    e.preventDefault();
    
    let newOp = this[rndmKey + 'input'].value.trim();
    let type = this[rndmKey + 'type'].value.trim();
    let branch = this[rndmKey + 'branch'].value.trim();
    
    Meteor.call('addTrackStepOption', newOp, type, branch, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        this[rndmKey + 'input'].value = '';
        this[rndmKey + 'type'].value = '';
        this[rndmKey + 'branch'].value = '';
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  return (
    <div className='invert space3v'>
      
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
      
      <ul>
        <form onSubmit={(e)=>addTrackOp(e)} className='inlineForm'>
          <label htmlFor={rndmKey + 'form'}>step<br />
            <input
              type='text'
              id={rndmKey + 'input'}
              required
            />
          </label>
          <label htmlFor={rndmKey + 'type'}>Type<br />
            <select 
              id={rndmKey + 'type'}
              className='tableAction'
              required
            >
              <option></option>
              <option value='first'>first</option>
              <option value='build'>build</option>
              <option value='inspect'>inspect</option>
              <option value='test'>test</option>
              <option value='checkpoint'>checkpoint</option>
              <option value='nest'>nest</option>
            </select>
          </label>
          <label htmlFor={rndmKey + 'branch'}>{Pref.branch}<br />
            <select id={rndmKey + 'branch'} required >
              <option></option>
              {branchesS.map( (entry, index)=>{
                return( 
                  <option key={index} value={entry.brKey}>{entry.branch}</option>
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
        
        <hr />
      
        
        <details>
          <summary>no branch</summary>
          {sorted.filter( s => !s.branchKey).map( (entry, index)=>{
            return( 
              <TrackStepEdit 
                key={rndmKey + index + entry.key} 
                app={app}
                branchesSort={branchesS}
                data={entry} />
          )})}
        </details>
        
        {branchesS.map( (bentry, bindex)=>{
          const bsteps = sorted.filter( s => s.branchKey === bentry.brKey);
          return(
            <details key={bindex+'b'} className='vmargin'>
              <summary>{bentry.branch}</summary>
              {bsteps.map( (entry, index)=>{
                return( 
                  <TrackStepEdit 
                    key={rndmKey + index + entry.key} 
                    app={app}
                    branchesSort={branchesS}
                    data={entry} />
              )})}
            </details>
        )})}
      </ul>
    </div>
  );
};

export default TrackStepSlide;