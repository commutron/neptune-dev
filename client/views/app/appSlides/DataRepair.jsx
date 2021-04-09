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
      toast.success('request sent');
    });
  }
  
  function doCallThing(mtrMethod) {
    Meteor.call(mtrMethod, (error, re)=>{
      error && console.log(error);
      re ? toast.success('success') : toast.error('unsuccessful');
    });
  }
  
  return(
    <div className='space3v autoFlex'>
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
      {/*<br />
      <hr />
      <h2 className='cap'>Fix Proto Key</h2>
      <button
        onClick={()=>fixDataKey()}
        className='action clear blackT orangeHover'
      >Fix Basline Time Key</button>
      <hr />
      <br />*/}
      
      <div>
        <h3><i className="fas fa-key fa-lg gap"></i>
          Run Batch and Batch+ Locker
        </h3>
        <small>Runs every Saturday at 12:01am (CST)</small><br />
        <button
          onClick={()=>forceLockCheck()}
          className='action clearPurple'
        >Request Locking</button>
      </div>
      
      <div>
        <h3><i className="fas fa-unlock-alt fa-lg gap"></i>
          Unlock All Batch+ (XBatchDB)
        </h3>
        <button
          onClick={()=>doCallThing("unlockALLxbatch")}
          className='action clearPurple'
        >Set `lock` to false</button>
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
          Build TraceDB
        </h3>
        <button
          onClick={()=>doCallThing("rebuildTrace")}
          className='action clearTeal'
        >FORCE Run TraceDB Rebuild</button>
      </div>
      
      <div>
        <h3><i className="fas fa-wrench fa-lg gap"></i>
          Fix TraceDB Errors
        </h3>
        <button
          onClick={()=>doCallThing("cleanupTraceErrors")}
          className='action clearOrange'
        >Fix Errors in TraceDB</button>
      </div>
      
      <div>
        <h3><i className="fas fa-snowplow fa-lg gap"></i>
          Fix BatchDB & XBatchDB Errors
        </h3>
        <button
          onClick={()=>doCallThing("fixRemoveDamagedBatch")}
          className='action clearRed'
        >Remove Damaged Batch</button>
      </div>
      
      <div>
        <h3><i className="fas fa-eraser fa-lg gap"></i>
          Rebuild the LatestSerial Object
        </h3>
        <button
          onClick={()=>doCallThing("ResetAppLatestSerial")}
          className='action clearOrange'
        >Rebuild</button>
      </div>
      
      <div>
        <h3><i className="fas fa-comment-medical fa-lg gap"></i>
          Convert All Batch+ Notes into Blocks
        </h3>
        <button
          onClick={()=>doCallThing("makeNotesIntoBlockXBatch")}
          className='action clearBlue'
        >Convert</button>
      </div>
      
      <div>
        <h3><i className="fas fa-shapes fa-lg gap"></i>
          Recreate Track Option without phase
        </h3>
        <button
          onClick={()=>doCallThing("resetTrackWithoutPhase")}
          className='action clearTeal'
        >Clear Phase</button>
      </div>
      
      
      <div>
        <h3><i className="fas fa-eraser fa-lg gap"></i>
          Unset the nonconformaces key from batch+
        </h3>
        <button
          onClick={()=>doCallThing("UNSETbplusNonconKey")}
          className='action clearOrange'
        >Unset "nonconformaces" Key</button>
      </div>
      
      <div>
        <h3><i className="fas fa-eraser fa-lg gap"></i>
          Unset the verifications key from batch+
        </h3>
        <button
          onClick={()=>doCallThing("UNSETbplusVeriKey")}
          className='action clearOrange'
        >Unset "verifications" Key</button>
      </div>
      
      <div>
        <h3><i className="fas fa-eraser fa-lg gap"></i>
          Unset the rapids key from batch+
        </h3>
        <button
          onClick={()=>doCallThing("UNSETbplusRapidKey")}
          className='action clearOrange'
        >Unset "rapid" Key</button>
      </div>
      
      <div>
        <h3><i className="fas fa-eraser fa-lg gap"></i>
          Unset the Omitted key from batch+
        </h3>
        <button
          onClick={()=>doCallThing("UNSETbplusOmittedKey")}
          className='action clearOrange'
        >Unset "omitted" Key</button>
      </div>
      
      
      <div>
        <h3><i className="fas fa-eraser fa-lg gap"></i>
          Unset the notes key from batch+
        </h3>
        <button
          onClick={()=>doCallThing("UNSETbplusNotesKey")}
          className='action clearOrange'
          disabled={true}
        >Unset Key</button>
      </div>
      
      {/*
      <div>
        <h3><i className="fas fa-screwdriver fa-lg gap orangeT"></i>
          Fix/Update Rapid Scheme
        </h3>
        <button
          onClick={()=>doCallThing("fixFirstRapids")}
          className='action clearOrange'
        >Fix Keys</button>
      </div>
      */}
      
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
        <h3><i className="fas fa-save fa-lg gap"></i>
          Repair NonCon "Where" Data
        </h3>
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