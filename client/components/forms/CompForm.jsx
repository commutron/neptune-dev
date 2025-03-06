import React from 'react';
import Pref from '/client/global/pref.js';

const CompForm = ({ vID })=> {
  
  function addParts() {
    this[vID+'add_comp_go'].disabled = true;
    
    const allNums = this[vID+'newparts'].value.trim().toLowerCase();
    
    const alterOne = allNums.replace(/\s* \s*/gi, "|");// spaces
    const alterTwo = alterOne.replace(/[\n\r]/g, "|");// new line
    const split = alterTwo.split("|");// split into array
    
    let indieNums = [... new Set(split) ];
    
    if(indieNums.length > 0) {
      Meteor.call('pushCompV', vID, indieNums, (error)=>{
        error && console.log(error);
        this[vID+'newparts'].value = '';
        this[vID+'add_comp_go'].disabled = false;
      });
    }
  }
  
  return(
    <form id='new' className='centre' onSubmit={(e)=>addParts(e)}>
      <p className='nomargin'>
        <textarea
          id={vID+'newparts'}
          rows='15'
          autoFocus={true}
          style={{resize:'vertical'}}
          required></textarea>
        <label htmlFor={vID+'newparts'}>{Pref.comp} Numbers (seperated by pipe, space or new line)</label>
      </p>
      <p className='nomargin'>
        <button
          id={vID+'add_comp_go'}
          disabled={false}
          className='action nSolid'
          type='submit'
          formMethod='dialog'
        >Add</button>
      </p>
    </form>
  );
};

export default CompForm;