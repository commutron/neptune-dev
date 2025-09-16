import moment from 'moment';
import 'moment-timezone';
import Config from '/server/hardConfig.js';
import { sortBranches } from '/server/utility';
import { addTideDuration } from '/server/tideGlobalMethods';

function deriveFromHistory(history, trackOptions, branchOptions) {
  
  const foundTrackKeys = _.uniq( _.pluck(history, 'key') );
  
  const key2branch = (key)=> {
    const obj = trackOptions.find( x => x.key === key );
    const branchKey = obj ? obj.branchKey : null;
    const branchObj = branchOptions.find( y => y.brKey === branchKey );
    return branchObj ? branchObj.branch : 'out of route';
  };
  
  const branches = Array.from(foundTrackKeys, x => key2branch(x) );
  const qbranches = _.countBy(branches, x => x);

  const entryBranches = Object.entries(qbranches);
  const uniqBranches = _.uniq( Array.from(entryBranches, z => z[0] ) );

  const cleanResult = uniqBranches.length > 0 && 
                      uniqBranches[0] !== null && uniqBranches[0] !== 'null' ? 
                      uniqBranches : false;
  return { cleanResult, qbranches };
}

function deriveFromProb(probObjs) {
  const probFlat = [].concat(...probObjs);

  const foundWhere = _.uniq( _.pluck(probFlat, 'where') );
  
  const qKeys = _.countBy(foundWhere, x => x);
  const uniqWhere = _.uniq(foundWhere);
  
  const cleanResult = uniqWhere.length > 0 ? uniqWhere : false;
  
  return { cleanResult, qKeys};
}

function tryFromHistory(tideStart, tStop, trackOptions, branchOptions, yourHistoryFlat) {

  const withinTide = yourHistoryFlat.filter( y => y.time > tideStart && 
                                                  y.time < tStop );
  
  const fromHistoryWithin = deriveFromHistory(withinTide, trackOptions, branchOptions);
  const fromHistoryWithinClean = fromHistoryWithin.cleanResult;

  return fromHistoryWithinClean;
}

function tryFromNC(tideStart, tStop, uID, nonCon) {
  const inBncN = nonCon.filter( x =>
    x.time > tideStart && x.time < tStop && x.who === uID );
  const inBncF = nonCon.filter( x =>
    x.fix !== false && x.fix.time > tideStart && x.fix.time < tStop && x.fix.who === uID );
  const inBncI = nonCon.filter( x =>
    x.inspect !== false && x.inspect.time > tideStart && x.inspect.time < tStop && x.inspect.who === uID );
  const anyNC = [...inBncN,...inBncF,...inBncI ] ;
  
  const fromNC = deriveFromProb(anyNC);
  const fromNCclean = fromNC.cleanResult;
  
  return fromNCclean;
}

function tryFromSH(tideStart, tStop, uID, shortfall) {
  const inBshC = shortfall.filter( x =>
    x.cTime > tideStart && x.cTime < tStop && x.cWho === uID );
  const inBshU = shortfall.filter( x =>
    x.uTime > tideStart && x.uTime < tStop && x.uWho === uID );
    
  const anySH = [...inBshC,...inBshU ] ;

  const fromSH = deriveFromProb(anySH);
  const fromSHclean = fromSH.cleanResult;
  
  return fromSHclean;
}

function tryFromWaterfall(tideStart, tStop, branchOptions, uID, waterfall) {
  
  let yourFall = [];
  for( let fall of waterfall ) { 
    if(fall.counts.filter( y => y.who === uID && y.time > tideStart && y.time < tStop 
      ).length > 0 ) 
    {
      const branchObj = branchOptions.find( y => y.brKey === fall.branchKey );
      yourFall.push( branchObj ? branchObj.branch : 'out of route' );
    }
  }
  const uniqBranches = _.uniq( yourFall );
  const cleanResult = uniqBranches.length > 0 && 
                      uniqBranches[0] !== null && uniqBranches[0] !== 'null' ? 
                      uniqBranches : false;

  return cleanResult;
}

function tryFromRelease(tideStart, tStop, releases) {
  const floorRelease = releases.find( x => x.type === 'floorRelease');
  
  const releasePrep = !floorRelease ? true :
                        moment(tStop).isBefore(floorRelease.time) || 
                        moment(tideStart).isBefore(floorRelease.time);
                        
  return releasePrep;
}

function tryFromFinish(tideStart, finishTime) {
  const finished = finishTime !== false && finishTime !== null;
  const afterFinish = finished && moment(tideStart)
                        .isAfter(moment(finishTime) );
  return afterFinish;
}

function tryFromHour(tStop, trackOptions, branchOptions, yourHistoryFlat) {
  const lastHourTide = yourHistoryFlat.filter( y => {
                          const dur = moment.duration(moment(tStop).diff(moment(y.time))).asMinutes();
                          return dur > 0 && dur <= 60;
                      });
                              
      
  const fromSameHour = deriveFromHistory(lastHourTide, trackOptions, branchOptions);
  const fromSameHourClean = fromSameHour.cleanResult;
  
  return fromSameHourClean;
}

function tryFromDay(tStop, trackOptions, branchOptions, yourHistoryFlat) {
  const sameDayTide = yourHistoryFlat.filter( y =>
                                    moment(y.time).tz(Config.clientTZ)
                      .isSame(moment(tStop).tz(Config.clientTZ), 'day') );

  const fromSameDay = deriveFromHistory(sameDayTide, trackOptions, branchOptions);
  const fromSameDayClean = fromSameDay.cleanResult;

  return fromSameDayClean;
}

function tryFromOpen(batchNum) {
  const brCache = TraceDB.findOne({batch: batchNum});
  const openBranches = brCache && brCache.branchCondition.filter( x => x.condition === 'open' );
  const fromOnlyOpen = openBranches && openBranches.length === 1 ?
                        openBranches[0].branchName : false;
  return fromOnlyOpen;
}

function tryFromNext(tideStart, widgetId, river, items) {
  const docW = WidgetDB.findOne({_id: widgetId});
  const flow = docW.flows.find( x => x.flowKey === river );
  const riverFlow = flow ? flow.flow : [];
  
  let riverSatus = [];
  let remainFirstBranch = new Set();
  for(const rvrstp of riverFlow) {
    if(rvrstp.type !== 'first') {
      const done100 = items.every( 
                        x => x.history.find( y =>
                          y.key === rvrstp.key &&
                          y.good === true &&
                          y.time < tideStart ) );
      riverSatus.push(done100);
    }else{
      riverSatus.push(null);
      const someFirst = items.some( 
                          x => x.history.find( y => 
                            y.key === rvrstp.key && 
                            y.good === true ) );
      if(!someFirst) {
        remainFirstBranch.add(rvrstp.branchKey);
      }else{null}
    }
  }
  const nextIndex = riverSatus.indexOf(false);
  let nextIncompleteBranch = nextIndex < 0 ? null :
                            riverFlow[nextIndex].branchKey;
  const alsoFirst = remainFirstBranch.has(nextIncompleteBranch);
  
  const nextPrepBranch = !alsoFirst ? null : nextIncompleteBranch;
  
  return nextPrepBranch;
}

  
function branchBestGuess(
  uID, tideStart, tideStop, 
  batchNum, widgetId, river, items, nonCon, shortfall, waterfall,
  releases, finishTime,
  trackOptions, branchOptions 
) {
  const tStop = tideStop ? tideStop : new Date();
  
  if(!batchNum) {
    return [ ['guessUnsupported'], [ "unavailable" ] ];
  }
    
    let yourHistory = [];
    for( let i of items ) { 
      yourHistory.push( i.history.filter( y => y.who === uID || 
                      ( y.type === 'first' && y.info.builder.includes(uID) ) )
      );
    }
    const yourHistoryFlat = [].concat(...yourHistory);
  
    const fromHistoryWithinClean = tryFromHistory(
                                    tideStart, tStop,
                                    trackOptions, branchOptions, 
                                    yourHistoryFlat);
  
  if(fromHistoryWithinClean) {
    return [ 'fromHistory', fromHistoryWithinClean ];
  }else{
    
    const fromNCclean = tryFromNC(tideStart, tStop, uID, nonCon);
    
    if(fromNCclean) {
      return [ 'fromNC', fromNCclean ];
    }else{
      
      const fromSHclean = tryFromSH(tideStart, tStop, uID, shortfall);
      
      if(fromSHclean) {
        return [ 'fromSH', fromSHclean ];
      }else{
         
        const fromWFclean = tryFromWaterfall(tideStart, tStop, 
                                              branchOptions, uID, waterfall);
          
        if(fromWFclean) {
          return [ 'fromWF', fromWFclean ];
        }else{  
          
        
          const releasePrep = tryFromRelease(tideStart, tStop, releases);
          
          if(releasePrep) {
            return [ 'fromRelease', ['before release'] ];
          }else{
              
            const afterFinish = tryFromFinish(tideStart, finishTime);
            
            if(afterFinish) {
              return [ 'fromAfterFinish', ['after complete'] ];
            }else{
          
              const fromSameHourClean = tryFromHour(tStop,
                                          trackOptions, branchOptions, 
                                          yourHistoryFlat);
               
              if(fromSameHourClean) {
                return [ 'fromSameHourHistory', fromSameHourClean ];
              }else{
                
                const fromSameDayClean = tryFromDay(tStop, 
                                          trackOptions, branchOptions, 
                                          yourHistoryFlat);
                 
                if(fromSameDayClean) {
                  return [ 'fromSameDayHistory', fromSameDayClean ];
                }else{
                      
                  if( !tideStop ) {
                    
                    const fromOnlyOpen = tryFromOpen(batchNum);
                    
                    if(fromOnlyOpen) {
                      return [ 'fromOnlyOpen', fromOnlyOpen ];
                    }else{
                      
                      const nextPrepBranch = tryFromNext(tideStart, widgetId, river, items);
                      
                      if(nextPrepBranch) {
                        const branchObj = branchOptions.find( y => y.brKey === nextPrepBranch );
                        const branchName = branchObj.branch; 
                        return [ 'nextPrepBranch', [`${branchName} prep`] ];
                      }else{
                        return [ 'noGuess', [ "" ] ];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}


Meteor.methods({
  
  getOneBranchBestGuess(batchNum, tideObj) {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const app = AppDB.findOne({ orgKey: accessKey });
    const branchOptions = sortBranches(app.branches);
    const trackOptions = [...app.trackOption, app.lastTrack];
    
    const batch = XBatchDB.findOne({batch: batchNum, orgKey: accessKey});
                  
    const series = XSeriesDB.findOne({batch: batchNum});
    
    const widgetId = batch.widgetId;
    const river = batch.river;
    const releases = batch.releases || [];
    const finishTime = batch.completedAt;
    const items = series ? series.items : [];
    const nonCon = series ? series.nonCon : [];
    const shortfall = series ? series.shortfall : [];
    const waterfall = batch.waterfall || [];
    
    const bestGuess = branchBestGuess(tideObj.who, tideObj.startTime, tideObj.stopTime,
                        batchNum, widgetId, river, items, nonCon, shortfall, 
                        waterfall, releases, finishTime, 
                        trackOptions, branchOptions);
                        
    return bestGuess;
  },
  
  assembleBranchTime(batchNum) {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const app = AppDB.findOne({ orgKey: accessKey});
    const branchOptions = sortBranches(app.branches);
    const trackOptions = [...app.trackOption, app.lastTrack];
    
    const batch = XBatchDB.findOne({batch: batchNum, orgKey: accessKey});
                  
    const series = XSeriesDB.findOne({batch: batchNum});
    
    const widgetId = batch.widgetId;
    const river = batch.river;
    const releases = batch.releases || [];
    const finishTime = batch.completedAt;
    const items = series ? series.items : [];
    const nonCon = series ? series.nonCon : [];
    const shortfall = series ? series.shortfall : [];
    const waterfall = batch.waterfall || [];
    
    let slimTimes = [];
    
    if( batch && Array.isArray(batch.tide) ) {  
      const slim = batch.tide.map( x => {
        const known = x.task ? [ 'fromUserInput', [ x.task ], x.subtask ] : null;
        const dt = known || 
          branchBestGuess(x.who, x.startTime, x.stopTime,
                        batchNum, widgetId, river, items, nonCon, shortfall, 
                        waterfall, releases, finishTime, 
                        trackOptions, branchOptions);
                        
        const dur = addTideDuration(x);
        return {
          branchGuess: dt,
          duration: dur,
          multi: x.focus ? true : false
        };
      });
      
      for(let br of branchOptions) {
        let brDurr = 0;
        let brMlti = false;
        
        const bslim = slim.filter( t => Array.isArray(t.branchGuess) &&
                        ( t.branchGuess[1].includes( br.branch ) || 
                          t.branchGuess[1].includes( br.branch + ' prep' ) )
                      );
        
        let subs = new Set();
        let subt = [];
        let sbtt = [];
        
        for(let bt of bslim) {
          brDurr = brDurr + ( bt.duration / bt.branchGuess[1].length );
          
          if(bt.branchGuess[2]) {
            subs.add(bt.branchGuess[2]);
            subt.push({ sub: bt.branchGuess[2], dur: bt.duration, mlt: bt.multi });
          }
          if( bt.multi ) { brMlti = true; }
        }
        
        for(let sb of subs) {
          const ft = subt.filter( f => f.sub === sb );
          const ct = ft.reduce((x,y)=> x + y.dur, 0);
          const ml = ft.some( s => s.mlt );
          sbtt.push({
            a: sb,
            b: ct,
            w: ml
          });
        }
        slimTimes.push({
          x: br.branch,
          y: brDurr,
          z: sbtt,
          w: brMlti
        });
      }
      let aDurr = 0;
      let aMlti = false;
      let zDurr = 0;
      let zMlti = false;
      let yDurr = 0;
      let yMlti = false;
      let xDurr = 0;
      let xMlti = false;
      for(let t of slim) {
        if( !t.branchGuess || t.branchGuess[1].includes( 'guessUnsupported' ) ) {
          xDurr = xDurr + t.duration;
          t.multi ? xMlti = true : null;
        }else if( t.branchGuess[1].includes( 'before release' ) ) {
          aDurr = aDurr + t.duration;
          t.multi ? aMlti = true : null;
        }else if( t.branchGuess[1].includes( 'after complete' ) ) {
          zDurr = zDurr + t.duration;
          t.multi ? zMlti = true : null;
        }else if( t.branchGuess[1].includes( 'out of route' ) ) {
          yDurr = yDurr + t.duration;
          t.multi ? yMlti = true : null;
        }else{
          null;
        }
      }
      slimTimes.unshift({ x: 'before release', y: aDurr, w: aMlti });
      slimTimes.push({ x: 'after complete', y: zDurr, w: zMlti });
      slimTimes.push({ x: 'out of route', y: yDurr, w: yMlti });
      slimTimes.push({ x: 'unknown', y: xDurr, w: xMlti });
      
      return slimTimes;
    }else{
      return slimTimes;
    }
  },
  
  collateBranchTime(batchNum) {
    this.unblock();
    const accessKey = Meteor.user().orgKey;
    const app = AppDB.findOne({ orgKey: accessKey});
    const branchOptions = sortBranches(app.branches);
    const qtOptions = app.qtTasks;
    //.sort((b1, b2)=> b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );
    
    // const trackOptions = [...app.trackOption, app.lastTrack];
    
    const batch = XBatchDB.findOne({batch: batchNum, orgKey: accessKey});
    // quoteTimeCycles // NEW
    // quoteTimeBreakdown: { // depreciated
    //   updatedAt: new Date(),
    //   timesAsMinutes: qTimeArr
    // },
        
    // const series = XSeriesDB.findOne({batch: batchNum});
    // const river = batch.river;
    // const waterfall = batch.waterfall || [];
    
    let slimTimes = [];
    
    if( batch && Array.isArray(batch.tide) ) {  
      const slim = batch.tide.map( x => {
        const dt = x.task ? [ x.task, x.subtask, x.qtKey ] : null;
                        
        const dur = addTideDuration(x);
        return {
          tasks: dt,
          duration: dur,
          multi: x.focus ? true : false
        };
      });
      
      for(let br of branchOptions) {
        let brDurr = 0;
        let brMlti = false;
        
        const brQts = qtOptions.filter( q => q.brKey === br.brKey );
        let brSubTasks = [];
        for( q of brQts) {
          brSubTasks.push(...q.subTasks);
        }
        
        const bslim = slim.filter( t => Array.isArray(t.tasks) &&
                        t.tasks[0] === br.branch );
        
        let subs = new Set();
        let qtKeys = new Set();
        let subt = [];
        let sbtt = [];
        
        let qtkArr = [];
        
        for(let bt of bslim) {
          brDurr = brDurr + ( bt.duration );
          
          if(bt.tasks[1]) {
            subs.add(bt.tasks[1]);
            
            bt.tasks[2] ? qtKeys.add(bt.tasks[2]) : null;
            
            subt.push({ 
              sub: bt.tasks[1], 
              dur: bt.duration, 
              mlt: bt.multi, 
              qt: bt.tasks[2]
            });
          }
          if( bt.multi ) { brMlti = true; }
        }
        
        for(let sb of subs) {
          const ft = subt.filter( f => f.sub === sb );
          const ct = ft.reduce((x,y)=> x + y.dur, 0);
          const ml = ft.some( s => s.mlt );
          sbtt.push({
            a: sb,
            b: ct,
            w: ml
          });
        }
        
        for(let qtk of qtKeys) {
          const byQt = subt.filter( f => f.qt === qtk );
          const sum = byQt.reduce((x,y)=> x + y.dur, 0);
          const ml = byQt.some( s => s.mlt );
          qtkArr.push({
            q: qtk,
            sum: sum,
            w: ml
          });
        }
        
        slimTimes.push({
          x: br.branch,
          y: brDurr,
          z: sbtt,
          w: brMlti,
          q: qtkArr
        });
      }
      let aDurr = 0;
      let aMlti = false;
      let zDurr = 0;
      let zMlti = false;
      let yDurr = 0;
      let yMlti = false;
      for(let t of slim) {
        if( t.tasks[0] === 'before release' ) {
          aDurr = aDurr + t.duration;
          t.multi ? aMlti = true : null;
        }else if( t.tasks[0] === 'after complete' ) {
          zDurr = zDurr + t.duration;
          t.multi ? zMlti = true : null;
        }else if( t.tasks[0] === 'out of route' ) {
          yDurr = yDurr + t.duration;
          t.multi ? yMlti = true : null;
        }else{
          null;
        }
      }
      slimTimes.unshift({ x: 'before release', y: aDurr, w: aMlti });
      slimTimes.push({ x: 'after complete', y: zDurr, w: zMlti });
      slimTimes.push({ x: 'out of route', y: yDurr, w: yMlti });
      
      return slimTimes;
    }else{
      return slimTimes;
    }
  }
  
  
});