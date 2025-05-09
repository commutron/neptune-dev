import React, { useState, Fragment } from 'react';
import { toast } from 'react-toastify';

const DataRepair = ({ app, users })=> {
  
  function forceLockCheck() {
    Meteor.call('lockingCacheUpdate', false, true, (error)=>{
      error && console.log(error);
      toast.success('Lock Request Completed', {autoClose: false});
    });
  }
  
  function doCallThing(mtrMethod, rtnLog) {
    Meteor.apply(mtrMethod, [], {wait: true}, (error, re)=>{
      error && console.log(error);
      re && toast.success((mtrMethod+' success'), {autoClose: false});
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
    <div className='space3v'>
      <div className='autoGrid cardify twoDfill'>
        <DoCard
          title='Force Randomize Org PIN'
          sub='Runs every day at 12:00am (CST)'
          icon='dice'
          color='nSolid'
          button='Randomize PIN'
          action={()=>doCallThing('randomizePIN')}
        />
        <DoCard
          title='Test DM Log Clear'
          sub='Runs every day at 12:01am (CST)'
          icon='message'
          color='nSolid'
          button='Clear +90 days'
          action={()=>doCallThing('removeOldDMLog')}
        />
        <DoCard
          title='Clear `Usage Logs` and `Breadcrubs`'
          sub='Only affects users with "debug" turned OFF'
          icon='user-shield'
          color='nSolid'
          button='Clear Logs'
          action={()=>doCallThing('clearNonDebugUserUsageLogs')}
        />
      </div>
      
      <h2 className='centreText vmargin yellowT dropCeiling borderOrange topLine'>Large Tasks - May Cause Disruption For All Users</h2>
      <div className='autoGrid cardify twoDfill'>
        
        <DoCard
          title='Run Maintenance Schedule Robot'
          sub='Runs every day at 12:02am (CST)'
          icon='robot'
          color='midnightSolid'
          button='Run Service Robot'
          action={()=>doCallThing('pmRobot')}
        />
      
        <div>
          <span>
            <h3><i className="fas fa-lock fa-lg gap"></i>Run Batch+ Locker</h3>
            <p className='small'>Runs every Saturday at 12:15am (CST)</p>
          </span>
          <button
            onClick={()=>forceLockCheck()}
            className='action purpleSolid'
          >Request Locking</button>
        </div>
        
        <DoCard
          title='Run Daily Avg Update'
          sub='Runs every Saturday at 12:20am (CST)'
          icon='calculator'
          color='purpleSolid'
          button='Request Update'
          action={()=>doCallThing('fetchWeekAvg')}
        />
        
        <DoCard
          title='Run All Widget Avg Update'
          sub='Runs every Saturday at 12:25am (CST)'
          icon='cash-register'
          color='purpleSolid'
          button='Request Update'
          action={()=>doCallThing('updateAllWidgetAvg')}
        />
      
        <DoCard
          title='Run Done Target (Month/Week) Loops CacheDB Update'
          sub='Runs Daily at 12:10am (CST)'
          icon='digital-tachograph'
          color='purpleSolid'
          button='Request Update'
          action={()=>doCallThing('forceRunTrendLoops')}
        />
        
        <DoCard
          title='FORCE Run TraceDB Rebuild'
          sub='Will freeze app while running'
          icon='recycle'
          color='tealSolid'
          button='Rebuild TraceDB'
          action={()=>doCallThing('rebuildTrace')}
        />
      
        <DoCard
          title='Run TraceDB Live Movement Update'
          sub='Runs every Weekday at 12:05am (CST) and 12:00pm (CST)'
          icon='sync'
          color='tealSolid'
          button='Update TraceDB'
          action={()=>doCallThing('updateLiveMovement')}
        />
        
        <DoCard
          title='Rebuild the LatestSerial Object'
          icon='barcode'
          color='tealSolid'
          button='Rebuild LatestSerial'
          action={()=>doCallThing('ResetAppLatestSerial')}
        />
        
        </div>
        
      <h2 className='centreText vmargin dropCeiling topLine'>Diagnostic</h2>
      <div className='autoGrid cardify twoDfill'>
        
        <div>
          <h3><i className="fas fa-superscript fa-lg gap"></i>
            Get Progress to Time values for <br /> Quadratic Regression Equation
          </h3>
          <button
            onClick={()=>doProgToTimeCurve()}
            className='action blackSolid'
          >Get Values</button>
        </div>
        
        <ShipDiagnose />
        
      </div>
      
      <h2 className='centreText vmargin redT dropCeiling borderRed topLine'>High Risk - Use With Extreme Caution</h2>
      <div className='autoGrid cardify twoDfill'>
        
        <DoCard
          title='Delete "Missed" Maintain Entries'
          icon='crosshairs'
          color='redSolid'
          button='Bulk Delete Entries'
          action={()=>doCallThing('removePMnoise')}
        />
        
        <DoCard
          title='Delete all CacheDB Entries'
          icon='snowplow'
          color='redSolid'
          button='Delete All Caches'
          action={()=>doCallThing('resetALLCacheDB')}
        />
      
        <DoCard
          title='Fix Errors in TraceDB'
          icon='wrench'
          color='redSolid'
          button='Fix Trace Errors'
          action={()=>doCallThing('cleanupTraceErrors')}
        />
        
        <DoCard
          title='Fix XBatchDB Errors'
          icon='hammer'
          color='redSolid'
          button='Remove Damaged Batch'
          action={()=>doCallThing('fixRemoveDamagedBatch')}
        />
      </div>
      <div className='autoFlex'>
      
        <NcCorrect />
      
        <AncCorrect app={app} />
      
      </div>
    </div>
  );
};

export default DataRepair;

const DoCard = ({ title, sub, icon, color, button, action })=> (
  <div>
    <span>
      <h3><i className={`fa-solid fa-${icon} fa-lg gap`}></i>{title}</h3>
      {sub && <p className='small'>{sub}</p>}
    </span>
    <button
      onClick={()=>action()}
      className={`action ${color}`}
    >{button}</button>
  </div>
);

const NcCorrect = ()=> {
  
  function fixAthing(e, oldText, newText, textMatch) {
    e.preventDefault();
    
    const matchType = textMatch === 'exact';
    
    Meteor.call('repairNonConsDANGEROUS', oldText, newText, matchType, 
    (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete', { autoClose: false }); }
    });
  }
  
  return(
    <div>
      <h3><i className="fas fa-map-marker-alt fa-lg gap"></i>
        Repair NonCon "Where" Data
      </h3>
      <p className='max250'>Potentialy very damaging. This will change data of all batches.</p>
      <p className='centreText'><b>Be VERY carefull</b></p>
      
      <form onSubmit={(e)=>fixAthing(e, oldText.value, newText.value, textMatch.value)}>
        <p><label>Old Where Text<br /><input id='oldText' /></label></p>
        <p><label>New Where Text<br /><input id='newText' /></label></p>
        <p><label>Text Match<br />
          <select id='textMatch'>
            <option value='exact'>Exact</option>
            <option value='fuzzy'>Fuzzy</option>
          </select>
        </label></p>
        <p>
          <button
            type='submit'
            className='action blackSolid'
          >Repair</button>
        </p>
      </form>
    </div>
  );
};

const AncCorrect = ({ app })=> {
  
  const [ currTask, setCurrTask ] = useState(false);
  const [ rplcTask, setrplcTask ] = useState(false);
  const [ rplcSubT, setrplcSubT ] = useState(false);
  
  const handleNewTask = (val)=> {
    if(!val || val === 'false') {
      setrplcTask(false);
      setrplcSubT(false);
    }else{
      const twoval = val.split("|");
      const tskval = twoval[0].trim();
      const sbtval = twoval[1].trim();
      setrplcTask( tskval );
      setrplcSubT( sbtval === '' ? false : sbtval);
    }
  };
  
  function fixAtaskthing(e) {
    e.preventDefault();
    if( currTask && rplcTask ) {
      Meteor.call('replaceTasksDANGEROUS', currTask, rplcTask, rplcSubT,
      (error, reply)=>{
        error && console.log(error);
        if(reply) { toast.success('data edit complete', { autoClose: false }); }
      });
    }
  }
  
  return(
    <div>
      <h3><i className="fas fa-exchange-alt fa-lg gap"></i>
        Replace "Ancillary Task" Data
      </h3>
      <p className='max250'>Potentialy very damaging. This will change data of all batches.</p>
      <p className='centreText'><b>Be VERY carefull</b></p>
      
      <form onSubmit={(e)=>fixAtaskthing(e)}>
        <p><label>Current Task<br />
          <select
            id='tskSlctCut'
            onChange={(e)=>setCurrTask(e.target.value)}
            required
            >
              <option value={false}></option>
              {app.ancillaryOption.map( (a, ix)=>(
                <option key={ix+'o1'} value={a}>{a}</option>
              ))}
          </select>
        </label></p>
        <p><label>New Task<br />
          <select
            id='tskSlctRec'
            onChange={(e)=>handleNewTask(e.target.value)}
            required
          >
            <option value={false}></option>
            <optgroup label='branches'>
              {app.branches.map( (v, ix)=>(
                <Fragment key={ix+'o2'}>
                <option value={v.branch + ' | '}>{v.branch}</option>
                {v.subTasks && v.subTasks.map( (stsk, ixs)=>(
                  <option key={ixs+'o3'} value={v.branch + ' | ' + stsk}>&emsp;{stsk}</option>
                ))}
                </Fragment>
              ))}
            </optgroup>
            <optgroup label='Other'>
              <option value='before release | '>before release</option>
              <option value='after finish | '>after finish</option>
              <option value='out of route | '>out of route</option>
              {/*<option value='extend | '>extend</option>*/}
            </optgroup>
          </select>
        </label></p>
        <p>
          <button
            type='submit'
            className='action blackSolid'
          >Replace</button>
        </p>
      </form>
    </div>
  );
};

const ShipDiagnose = ()=> {
  
  function requestDiagnostic(e) {
    e.preventDefault();
    const id = this.inputBid.value;
    Meteor.call('diagnosePriority', id, (err, re)=>{
      err && console.log(err, err.message);
      console.log(re);
    });
  }
  
  return(
    <div>
      <h3><i className="fas fa-stethoscope fa-lg gap"></i>
        Ship and Quote Diagnostic
      </h3>
      <form onSubmit={(e)=>requestDiagnostic(e)}>
        <p>
          <input
            id='inputBid'
            placeholder='XBatch _id'
            required
          />
        </p>
        <p>
          <button
            className='action blueSolid'
            type='submit'
          >Request Log</button>
        </p>
      </form>
    </div>
  );
};
      
export const ForceStopEngage = ({ userID, isAdmin, isDebug })=> {
  
  function handle() {
    Meteor.call('errorFixForceClearEngage', userID, (error)=>{
      error && console.log(error);
    });
  }
  
  if(isAdmin && isDebug) {
    return(
      <button
        className='action redSolid'
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
        className='action redSolid'
        onClick={(e)=>handle(e)}
      >Force Pop Last Tide Block</button>
    );
  }
  
  return(null);
};