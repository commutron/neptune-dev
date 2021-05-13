import React from 'react';
//import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';
import { toast } from 'react-toastify';

const DataRepair = ({ app, users })=> {
  
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
  
  function forceLockCheck() {
    Meteor.call('lockingCacheUpdate', false, true, (error)=>{
      error && console.log(error);
      toast.success('Lock Request Completed');
    });
  }
  
  function doCallThing(mtrMethod) {
    Meteor.call(mtrMethod, (error, re)=>{
      error && console.log(error);
      re && toast.success('success');
    });
  }
  
  return(
    <div className='space3v autoFlex'>
    
      <div>
        <h3><i className="fas fa-key fa-lg gap"></i>
          Run Batch+ Locker
        </h3>
        <small>Runs every Saturday at 12:01am (CST)</small><br />
        <button
          onClick={()=>forceLockCheck()}
          className='action clearPurple'
        >Request Locking</button>
      </div>

      <div>
        <h3><i className="fas fa-hammer fa-lg gap"></i>
          Delete all CacheDB Entries
        </h3>
        <button
          onClick={()=>doCallThing("resetALLCacheDB")}
          className='action clearRed'
        >Delete All Caches</button>
      </div>
      
      <div>
        <h3><i className="fas fa-screwdriver fa-lg gap"></i>
          FORCE Run TraceDB Rebuild
        </h3>
        <button
          onClick={()=>doCallThing("rebuildTrace")}
          className='action clearTeal'
        >Rebuild TraceDB</button>
      </div>
      
      <div>
        <h3><i className="fas fa-barcode fa-lg gap"></i>
          Rebuild the LatestSerial Object
        </h3>
        <button
          onClick={()=>doCallThing("ResetAppLatestSerial")}
          className='action clearTeal'
        >Rebuild LatestSerial</button>
      </div>
      
      <div>
        <h3><i className="fas fa-wrench fa-lg gap"></i>
          Fix TraceDB Errors
        </h3>
        <button
          onClick={()=>doCallThing("cleanupTraceErrors")}
          className='action clearRed'
        >Fix Errors in TraceDB</button>
      </div>
      
      <div>
        <h3><i className="fas fa-snowplow fa-lg gap"></i>
          Fix XBatchDB Errors
        </h3>
        <button
          onClick={()=>doCallThing("fixRemoveDamagedBatch")}
          className='action clearRed'
        >Remove Damaged Batch</button>
      </div>
      
      <div>
        <h3><i className='fas fa-user-shield fa-lg gap'></i>
          Clear `Usage Logs` and `Breadcrubs`
        </h3>
        <button
          className='action clearBlue'
          onClick={()=>doCallThing("clearNonDebugUserUsageLogs")}
        >Clear Users with "debug" turned OFF</button>
      </div>
      
      
      <div>
        <h3><i className="fas fa-screwdriver fa-lg gap"></i>
          Fix Tide Task "false" Errors
        </h3>
        <button
          onClick={()=>doCallThing("repairFalseTask")}
          className='action clearOrange'
        >Fix Errors</button>
      </div>
      
      
      <div>
        <h3><i className="fas fa-save fa-lg gap"></i>
          Repair NonCon "Where" Data
        </h3>
        <p>Potentialy very damaging. This will change data of all batches.</p>
        <p><b>Be VERY carefull</b></p>
        
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
            className='action clearBlack'
          >fix</button>
        </form>
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