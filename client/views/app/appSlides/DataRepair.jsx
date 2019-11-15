import React from 'react';
//import Pref from '/client/global/pref.js';
import moment from 'moment';
import 'moment-timezone';
import { toast } from 'react-toastify';

const DataRepair = ({ app, users })=> {
  
  // function fixDataKey() {
  //   Meteor.call('dataFIXquoteBaseline', (error, reply)=>{
  //     error && console.log(error);
  //     if(reply) { toast.success('data edit complete', { autoClose: false }); }
  //   });
  // }
  
  // function fixDuplicateSerial(e, batchText, serialNum, dateStamp) {
  //   e.preventDefault();
  //   Meteor.call('dataFIXduplicateserial', batchText, serialNum, dateStamp, (error, reply)=>{
  //     error && console.log(error);
  //     if(reply) { toast.success('data edit complete', { autoClose: false }); }
  //   });
  // }
  
  
  function fixAthing(e, oldText, newText, textMatch) {
    e.preventDefault();
    
    const matchType = textMatch === 'exact';
    
    Meteor.call('repairNonConsDANGEROUS', oldText, newText, matchType, (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  
  function reorderPhaseOp(e) {
    e.preventDefault();
    const list = this.ph001input.value.trim();
    const listAsArray = list.split(',');
    const listAsArrayClean = [...listAsArray.map( (ent, ix)=>{ return ent.toLowerCase().trim(); }) ];
    console.log(listAsArrayClean);
    Meteor.call('reorderPhaseOptions', listAsArrayClean, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('good');
      }else{
        toast.warning('no good');
      }
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
  
  function updateCaches() {
    const clientTZ = moment.tz.guess();
    Meteor.call('FORCEcacheUpdate', clientTZ, (error)=>{
      error && console.log(error);
      toast.success('request sent', { autoClose: false });
    });
  }
  
  function clearAllWatch() {
    Meteor.call('clearAllUserWatchlists', (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  
  function clearUserLogs() {
    Meteor.call('clearNonDebugUserUsageLogs', (error)=>{
      error && console.log(error);
      toast.success('request sent');
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
      
      <hr />
      {/*
      <div className='vspace'>
      <h2 className='cap'>Force Delete Serial Number</h2>
      <form onSubmit={(e)=>fixDuplicateSerial(e, batchText.value, serialText.value, dateText.value)}>
        <p>Batch: <input id='batchText' /></p>
        <br /><br />
        <p>Serial: <input id='serialText' /></p>
        <br /><br />
        <p>ISODate: <input id='dateText' /></p>
        <br /><br />
        <button
          type='submit'
          className='action clear blackT'
        >fix duplicate serial</button>
      </form>
      </div>
      */}
      <hr />
      {/*<br />
      <hr />
      <h2 className='cap'>Fix Proto Key</h2>
      <button
        onClick={()=>fixDataKey()}
        className='action clear blackT orangeHover'
      >Fix Basline Time Key</button>
      <hr />
      <br />*/}
      
      <h2 className='cap'>Force Update ChacheDB</h2>
      <button
        onClick={()=>updateCaches()}
        className='action clear blackT'
      >Force Update Cache</button>
      
      <hr />
      
      <h2 className='cap'>Clear All User Watchlists</h2>
      <button
        onClick={()=>clearAllWatch()}
        className='action clear blackT'
      >Clear</button>
      
      <hr />
      
      <form 
        id='ph001form'
        onSubmit={(e)=>reorderPhaseOp(e)}
        className='inlineForm'>
        <label htmlFor='ph001input'>New List<br />
          <input
            type='text'
            id='ph001input'
            placeholder='surface mount, through hole ...'
            required
          />
        </label>
        <label htmlFor='ph001go'><br />
          <button
            type='submit'
            id='ph001go'
            className='smallAction clearGreen'
            disabled={false}
          >Change</button>
        </label>
      </form>
      
      <hr />
      
      <div>
        <p><b><i className='fas fa-user-shield fa-fw'></i>  Privacy</b></p>
        <p>
          <button
            className='action clearBlue invert'
            onClick={()=>clearUserLogs()}
          >Clear `Usage Logs` and `Breadcrubs` of users with "debug" turned OFF</button>
        </p>
      </div>
    </div>
  );
};

export default DataRepair;