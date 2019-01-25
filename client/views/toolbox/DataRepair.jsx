import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const DataRepair = ({ orb, bolt, app, users })=> {
  
  function fixAthing(e, oldText, newText, textMatch) {
    e.preventDefault();
    
    const matchType = textMatch === 'exact';
    
    Meteor.call('repairNonConsDANGEROUS', oldText, newText, matchType, (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  /*
  function addAthing() {
    const departArray = [
      'surface mount',
      'through hole',
      'selective solder',
      'wave solder',
      'testing',
      'conformal coat',
      'shipping',
      'finish'
    ];
    Meteor.call('addPhasesRepair', departArray, (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  */
  function clearAthing() {
    Meteor.call('clearBreadcrumbsRepair', (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  
  function updateAcache() {
    Meteor.call('FORCEbatchCacheUpdate', (error)=>{
      error && console.log(error);
      toast.success('request sent', { autoClose: false });
    });
  }
  
  return (
    <div className='invert'>
      <h2 className='cap'>NonCon "Where" Data Repair</h2>
      <p>Potentialy very damaging. This will change data of all batches. Be VERY carefull</p>
      
      <form onSubmit={(e)=>fixAthing(e, oldText.value, newText.value, textMatch.value)}>
        <input id='oldText' />
        <br /><br />
        <input id='newText' />
        <br /><br />
        <select id='textMatch'>
          <option value='exact'>Exact</option>
          <option value='fuzzy'>Fuzzy</option>
        </select>
        <br /><br />
        <button
          type='submit'
          className='action clear blackT'
        >fix</button>
      </form>
      
      
      <h2 className='cap'>Force Update batchInfo in ChacheDB</h2>
      <button
        onClick={()=>updateAcache()}
        className='action clear blackT'
      >Force Update</button>
      
      <h2 className='cap'>Clear User breadcrumbs</h2>
      <p>On current logged in user</p>
      
      <button
        onClick={()=>clearAthing()}
        className='action clear blackT'
      >Clear</button>
      
    </div>
  );
};

export default DataRepair;