import React from 'react';
import Pref from '/client/global/pref.js';

import ModelNative from '/client/layouts/Models/ModelNative';

const CompForm = ({ vID })=> {
  
  function addParts(e) {
    e.preventDefault();
    this.add_comp_go.disabled = true;
    
    const allNums = this.parts.value.trim().toLowerCase();
    
    const alterOne = allNums.replace(/\s* \s*/gi, "|");// spaces
    const alterTwo = alterOne.replace(/[\n\r]/g, "|");// new line
    const split = alterTwo.split("|");// split into array
    
    let indieNums = [... new Set(split) ];
    
    Meteor.call('pushCompV', vID, indieNums, (error)=>{
      error && console.log(error);
      this.parts.value = '';
      this.add_comp_go.disabled = false;
    });
  }
  
  return(
    <ModelNative
      dialogId={vID+'_comp_form'}
      title={'Add ' + Pref.comp + 's'}
      icon='fa-solid fa-shapes'
      colorT='nT'>
      
    <form id='new' className='centre' onSubmit={(e)=>addParts(e)}>
      <p>Add multiple {Pref.comp}s seperated by pipe, space or new line</p>
      <p>
        <textarea
          id='parts'
          cols='40'
          rows='15'
          autoFocus={true}
          required></textarea>
        <label htmlFor='parts'>{Pref.comp} Numbers</label>
      </p>
      <p>
        <button
          id='add_comp_go'
          disabled={false}
          className='action nSolid'
          type='submit'>Add</button>
      </p>
    </form>
    </ModelNative>
  );
};

export default CompForm;