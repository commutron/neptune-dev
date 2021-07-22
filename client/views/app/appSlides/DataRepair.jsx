import React from 'react';
import { toast } from 'react-toastify';

const DataRepair = ({ app, users })=> {
  
  function fixAthing(e, oldText, newText, textMatch) {
    e.preventDefault();
    
    const matchType = textMatch === 'exact';
    
    Meteor.call('repairNonConsDANGEROUS', oldText, newText, matchType, (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  
  function forceLockCheck() {
    Meteor.call('lockingCacheUpdate', false, true, (error)=>{
      error && console.log(error);
      toast.success('Lock Request Completed', {autoClose: false});
    });
  }
  
  function doCallThing(mtrMethod, rtnLog) {
    Meteor.call(mtrMethod, (error, re)=>{
      error && console.log(error);
      re && toast.success('success', {autoClose: false});
      if(rtnLog) {
        console.log(re);
      }
    });
  }
  
  function doProgToTimeCurve() {
    Meteor.call('getAvgTimeShare', (err, reply)=>{
	    err && console.log(err);
	    if(reply) {
	      toast(JSON.stringify([
          `1% = ${reply[0]}%`,
          `10% = ${reply[1]}%`,
          `25% = ${reply[2]}%`,
          `50% = ${reply[3]}%`,
          `75% = ${reply[4]}%`,
          `90% = ${reply[5]}%`
        ]), { 
          closeOnClick: false,
          draggable: false,
          autoClose: false 
        });
      }
    });
  }
  
  return(
    <div className='space3v autoFlex'>
      
      <DoCard
        title='Force Randomize Org PIN'
        sub='Runs every day at 12:00am (CST)'
        icon='user-secret'
        color='clearPurple'
        button='Randomize PIN'
        action={()=>doCallThing('randomizePIN')}
      />
      
      <div>
        <h3><i className="fas fa-lock fa-lg gap"></i>
          Run Batch+ Locker
        </h3>
        <small>Runs every Saturday at 12:01am (CST)</small><br />
        <button
          onClick={()=>forceLockCheck()}
          className='action clearPurple'
        >Request Locking</button>
      </div>
      
      <DoCard
        title='Run Daily Avg Update'
        sub='Runs every Saturday at 12:03am (CST)'
        icon='calculator'
        color='clearPurple'
        button='Request Update'
        action={()=>doCallThing('fetchWeekAvg')}
      />
      
      <DoCard
        title='Run All Widget Avg Update'
        sub='Runs every Saturday at 12:04am (CST)'
        icon='cash-register'
        color='clearPurple'
        button='Request Update'
        action={()=>doCallThing('updateAllWidgetAvg')}
      />
      
      <DoCard
        title='FORCE Run TraceDB Rebuild'
        sub='Will freeze app while running'
        icon='screwdriver'
        color='clearTeal'
        button='Rebuild TraceDB'
        action={()=>doCallThing('rebuildTrace')}
      />
      
      <DoCard
        title='Run TraceDB Live Movment Update'
        sub='Runs every Weekday at 12:02am (CST) and 12:02pm (CST)'
        icon='sync'
        color='clearTeal'
        button='Update TraceDB'
        action={()=>doCallThing('updateLiveMovement')}
      />
      
      <DoCard
        title='Rebuild the LatestSerial Object'
        icon='barcode'
        color='clearTeal'
        button='Rebuild LatestSerial'
        action={()=>doCallThing('ResetAppLatestSerial')}
      />
      
      <DoCard
        title='Delete all CacheDB Entries'
        icon='hammer'
        color='clearRed'
        button='Delete All Caches'
        action={()=>doCallThing('resetALLCacheDB')}
      />
      
      <DoCard
        title='Fix Errors in TraceDB'
        icon='wrench'
        color='clearRed'
        button='Fix Trace Errors'
        action={()=>doCallThing('cleanupTraceErrors')}
      />
      
      <DoCard
        title='Fix XBatchDB Errors'
        icon='snowplow'
        color='clearRed'
        button='Remove Damaged Batch'
        action={()=>doCallThing('fixRemoveDamagedBatch')}
      />
      
      <DoCard
        title='Clear `Usage Logs` and `Breadcrubs`'
        sub='Only affects users with "debug" turned OFF'
        icon='user-shield'
        color='clearBlue'
        button='Clear Logs'
        action={()=>doCallThing('clearNonDebugUserUsageLogs')}
      />
      
      <div>
        <h3><i className="fas fa-superscript fa-lg gap"></i>
          Get Progress to Time values for <br /> Quadratic Regression Equation
        </h3>
        <button
          onClick={()=>doProgToTimeCurve()}
          className='action clearBlack'
        >Get Values</button>
      </div>
      
      <div>
        <h3><i className="fas fa-map-marker-alt fa-lg gap"></i>
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
      
      
      
      <hr />
      
      <DoCard
        title='Clear former Migrated widget Versions'
        icon='question'
        color='clearOrange'
        button='UNSET thing'
        action={()=>doCallThing('UNSEToldwidgetversionsArray', true)}
      />
      
      
    </div>
  );
};

export default DataRepair;

const DoCard = ({ title, sub, icon, color, button, action })=> (
  <div>
    <h3><i className={`fas fa-${icon} fa-lg gap`}></i>
      {title}
    </h3>
    {sub && <small>{sub}</small>}
    <br />
    <button
      onClick={()=>action()}
      className={`action ${color}`}
    >{button}</button>
  </div>
);

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