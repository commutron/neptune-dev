import React from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

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
        Bert.alert(Alert.warning);
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
        <label htmlFor={rndmKey + 'type'}>Department<br />
          <select id={rndmKey + 'phase'} required >
            <option></option>
            <option value='surface mount'>Surface Mount</option>
            <option value='through hole'>Through Hole</option>
            <option value='selective solder'>Selective Solder</option>
            <option value='wave solder'>Wave Solder</option>
            <option value='testing'>Testing</option>
            <option value='conformal coat'>Conformal Coat</option>
            <option value='shipping'>Shipping</option>
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
          return ( 
            <TrackStepEdit key={index} data={entry} />
        )})}
      </ul>
    </div>
  );
};

export default TrackStepSlide;