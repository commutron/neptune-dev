import React from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';

const CompForm = ({ id, versionKey, smIcon })=> {
  
  function addParts(e) {
    e.preventDefault();
    this.go.disabled = true;
    
    const vKey = versionKey;
    const allNums = this.parts.value.trim().toLowerCase();
    
    const alterOne = allNums.replace(/\s* \s*/gi, "|");// spaces
    const alterTwo = alterOne.replace(/[\n\r]/g, "|");// new line
    const split = alterTwo.split("|");// split into array
    
    let indieNums = [... new Set(split) ];
    
    Meteor.call('pushComp', id, vKey, indieNums, (error)=>{
      if(error)
        console.log(error);
      this.parts.value = '';
      this.go.disabled = false;
    });
  }
  
  return (
    <Model
      button={'Add ' + Pref.comp + 's'}
      title={'Add ' + Pref.comp + 's'}
      color='greenT'
      icon='fa-microchip'
      smIcon={smIcon}
      lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'edit'])}>
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
    </Model>
  );
};

export default CompForm;