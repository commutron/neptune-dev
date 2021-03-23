import React from 'react';
import Pref from '/client/global/pref.js';

import ModelMedium from '../smallUi/ModelMedium';

const CompModel = ({ vID, lockOut })=> (

  <ModelMedium
    button={'Add ' + Pref.comp + 's'}
    title={'Add ' + Pref.comp + 's'}
    color='greenT'
    icon='fa-microchip'
    lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit']) || lockOut}>
  
    <CompForm
      vID={vID}
    />
  </ModelMedium>
);

export default CompModel;

const CompForm = ({ vID, selfclose })=> {
  
  function addParts(e) {
    e.preventDefault();
    this.go.disabled = true;
    
    const allNums = this.parts.value.trim().toLowerCase();
    
    const alterOne = allNums.replace(/\s* \s*/gi, "|");// spaces
    const alterTwo = alterOne.replace(/[\n\r]/g, "|");// new line
    const split = alterTwo.split("|");// split into array
    
    let indieNums = [... new Set(split) ];
    
    Meteor.call('pushCompV', vID, indieNums, (error)=>{
      error && console.log(error);
      selfclose();
    });
  }
  
  return (
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
          id='go'
          disabled={false}
          className='action clearGreen'
          type='submit'>Add</button>
      </p>
    </form>
  );
};