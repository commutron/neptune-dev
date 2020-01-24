import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';

const PanelBreak = (props)=> {
  
  const [ newSerials, newSerialsSet ] = useState([]);
  
  function setSerials(e) {
    const srlInput = this.serials.value.trim().replace(",", " ");
    let cutInput = srlInput.split(/\s* \s*/gi);
    newSerialsSet( cutInput );
  }
  
  function splitApart(e) {
    e.preventDefault();
    const id = props.id;
    const batch = props.batch;
    const serial = props.item.serial;
    
    if(newSerials.length > 0) {
      let overlap = newSerials.find( x => x === serial);
      if(!overlap) {
      const verfiy = confirm("This is destuctive of the original, are you sure?");
        if(verfiy === true) {
          Meteor.call('breakItemIntoUnits', id, serial, newSerials, (error, reply)=>{
            if(error)
            console.log(error);
          if(reply) {
            FlowRouter.go('/data/batch?request=' + batch);
            toast.success('Saved');
          }else{
            toast.error('Server Error');
          }
          });
        }else{toast.error('Error');}
      }else{toast.error('Error');}
    }else{toast.error('Error');}
  }
      	    
  const auth = Roles.userIsInRole(Meteor.userId(), 'remove');
  let done = props.item.finishedAt !== false;

  return(
    <Model
      button='Split Panel'
      title='Split Panel Into Its Units'
      color='yellowT'
      icon='fa-cut'
      lock={done || props.item.units < 2 || !auth}
      noText={props.noText}>
      <p className='medBig space'>
        <b>Transform this item into new individual units</b><br />
        <i>New Items are created with a copy of this item's history</i><br />
        <i>NonConformances WILL BE LOST</i><br />
        <i>The new serial numbers are NOT checked for duplicates</i><br />
        <i>The highest serial number is NOT saved in the app settings</i><br />
        <i>The original IS deleted</i><br />
      </p>
      <br />
      <form
        className='centre'
        onSubmit={(e)=>splitApart(e)}>
        <div className='balance'>
          <p>
            <textarea
              id='serials'
              onChange={(e)=>setSerials(e)}
              cols='5'
              rows='5'
              defaultValue=''
              autoFocus={true}></textarea>
            <label htmlFor='con'>New serials for each new item</label>
            <br />
            <em>{props.item.units} numbers, seperated by a space</em>
          </p>
          <ol className='medBig'>
            {newSerials.map( (entry, index)=>{
              return( <li key={index}>{entry}</li> );
            })}
          </ol>
        </div>
        <p>
          <button
            id='go'
            disabled={newSerials.length !== props.item.units}
            className='action clearGreen'
            type='submit'>Split</button>
        </p>
      </form>
    </Model>
  );
};

export default PanelBreak;