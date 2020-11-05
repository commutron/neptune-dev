import React from 'react';
//import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';
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
  /*
  function clearAuserThing() {
    Meteor.call('UNSETwatchlistKey', (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }*/
  
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
  /*
  function rebuildTheBigThing() {
    toast.warn('Method Called, Please Wait...', {
      toastId: ( 'ReBuildAllOp' ),
      autoClose: false
    });
        
    Meteor.call('migrateALLWidgetVersions', (error, reply)=>{
      error && console.log(error);
      if(reply === true) {
        toast.update(( 'ReBuildAllOp' ), {
          render: "Complete Success",
          type: toast.TYPE.SUCCESS,
          autoClose: 10000
        });
      }else{
        toast.error('There was a problem...');
      }
    });
  }
  */
  function updateCaches() {
    Meteor.call('FORCEcacheUpdate', (error)=>{
      error && console.log(error);
      toast.success('method coomplete', { autoClose: false });
    });
  }
  
  function clearAllCaches() {
    Meteor.call('resetALLCacheDB', (error)=>{
      error && console.log(error);
      toast.success('method called', { autoClose: false });
    });
  }
  
  function clearUserLogs() {
    Meteor.call('clearNonDebugUserUsageLogs', (error)=>{
      error && console.log(error);
      toast.success('request sent');
    });
  }
  
  return (
    <div className='space3v'>
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
      
      <h2 className='cap'>Delete all CacheDB Entries</h2>
      <button
        onClick={()=>clearAllCaches()}
        className='action clear redT'
      >Delete All Caches</button>
      
      <hr />
      
      <h2 className='cap'>Force Update CacheDB Entries</h2>
      <button
        onClick={()=>updateCaches()}
        className='action clear blackT'
      >Force Update All Caches</button>
      
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



export const ForceStopEngage = ({ userID, isAdmin, isDebug })=> {
  
  function handle() {
    Meteor.call('errorFixForceClearEngage', userID, (error)=>{
      error && console.log(error);
    });
  }
  
  if(isAdmin && isDebug) {
    return(
      <button
        className='action clearRed'
        onClick={(e)=>handle(e)}
      >Force Clear Engaged</button>
    );
  }
  
  return(null);
};

export const ForceRemoveTideBlock = ({ batch, isAdmin, isDebug })=> {
  
  function handle(e) {
    this.doFORCEremoveTide.disabled = true;
    Meteor.call('errorFixDeleteTideTimeBlock', batch, (error)=>{
      error && console.log(error);
    });
  }
  
  if(isAdmin && isDebug) {
    return(
      <button
        id='doFORCEremoveTide'
        disabled={false}
        className='smallAction clearRed'
        onClick={(e)=>handle(e)}
      >Force Pop Last Tide Block</button>
    );
  }
  
  return(null);
};