import React from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';
//requires
// id

const NCEscape = (props)=> {

  function handleNC(e) {
    e.preventDefault();
    this.go.disabled = true;
    
    const batchId = props.id;  
    const type = this.ncType.value.trim().toLowerCase();
    const quant = this.quNum.value.trim().toLowerCase();
    const ncar = this.ncar.value.trim().toLowerCase();
    
    const refEntry = this.ncRefs.value.trim().toLowerCase();
    const refSplit = refEntry.split(' ');
      
    for(var ref of refSplit) {
      Meteor.call('addEscape', batchId, ref, type, quant, ncar, (error)=>{
        if(error)
          console.log(error);
      });
    }
    
    this.ncRefs.value = '';
    this.quNum.value = '';
    this.out.value = 'saved';
  }
  
  function on(e) {
    this.go.disabled = false;
    this.out.value = '';
  }

  return (
    <Model
      button='escaped'
      title={'record escaped ' + Pref.nonCon}
      color='orangeT'
      icon='fa-bug'
      lock={!Roles.userIsInRole(Meteor.userId(), ['run', 'qa'])}
      noText={props.noText}>
      <div className='centre'>
        <br />
        <form className='centre' onSubmit={(e)=>handleNC(e)} onChange={(e)=>on(e)}>
          <p>
            <input
              type='text'
              id='ncRefs'
              className='redIn'
              placeholder='eg. R45'
              autoFocus='true'
              required />
            <label htmlFor='ncRefs'>{Pref.nonConRef}</label>
          </p>
          <p>
            <select 
              id='ncType'
              className='cap redIn'
              required >
              {props.nons.map( (entry, index)=>{
                return ( 
                  <option key={index} value={entry}>{entry}</option>
                  );
              })}
            </select>
            <label htmlFor='ncType'>{Pref.nonConType}</label>
          </p>
          <p>
            <input
              type='number'
              id='quNum'
              className='redIn'
              max='100000'
              min='1'
              inputMode='numeric'
              placeholder='10'
              required />
            <label htmlFor='quNum'>Quantity</label>
          </p>
          <p>
            <input
              type='text'
              id='ncar'
              className='redIn'
              required />
            <label htmlFor='ncar'>ncar</label>
          </p>
          <p>
            <button
              type='submit'
              id='go'
              disabled={false}
              className='action clearRed'
            >{Pref.post}</button>
          </p>
          <p><output id='out' /></p>
        </form>
      </div>
    </Model>
  );
};

export default NCEscape;