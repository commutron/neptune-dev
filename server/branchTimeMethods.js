import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';
import Config from '/server/hardConfig.js';

function deriveFromHistory(history, trackOptions, branchOptions) {
  
  const foundTrackKeys = _.pluck(history, 'key');
  
  const key2branch = (key)=> {
    const obj = trackOptions.find( x => x.key === key );
    const branchKey = obj ? obj.branchKey : null;
    const branchObj = branchOptions.find( y => y.brKey === branchKey );
    return branchObj ? branchObj.branch : 'out of route';
  };
  
  const branches = Array.from(foundTrackKeys, x => key2branch(x) );
  const qbranches = _.countBy(branches, x => x);
  // const qKeysClean = _.omit(qKeys, (value, key)=> {
  //   return key == false;
  // });
  
  const entryBranches = Object.entries(qbranches);
  const uniqBranches = _.uniq( Array.from(entryBranches, z => z[0] ) );

  const cleanResult = uniqBranches.length > 0 && 
                      uniqBranches[0] !== null && uniqBranches[0] !== 'null' ? 
                      uniqBranches : false;
  return { cleanResult, qbranches };
}

function deriveFromProb(probObjs) {
  const probFlat = [].concat(...probObjs);

  const foundWhere = _.pluck(probFlat, 'where');
  
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
  // const fromHistoryWithinTally= fromHistoryWithin.qbranches;
  
  // console.log(fromHistoryWithinTally);
  
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
  // const fromNCtally = fromNC.qKeys;
  
  // console.log(fromNCtally);
  
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
  // const fromSHtally = fromSH.qKeys;
  
  // console.log(fromSHtally);
  return fromSHclean;
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
  const sameHourTide = yourHistoryFlat.filter( y => // duration ???
                                    moment(y.time).tz(Config.clientTZ)
                                    .isSame(moment(tStop).tz(Config.clientTZ), 'hour') );
      
  const fromSameHour = deriveFromHistory(sameHourTide, trackOptions, branchOptions);
  const fromSameHourClean = fromSameHour.cleanResult;
  // const fromSameHourTally= fromSameHour.qbranches;
  
  // console.log(fromSameHourTally);
  return fromSameHourClean;
}

function tryFromDay(tStop, trackOptions, branchOptions, yourHistoryFlat) {
  const sameDayTide = yourHistoryFlat.filter( y =>
                                    moment(y.time).tz(Config.clientTZ)
                      .isSame(moment(tStop).tz(Config.clientTZ), 'day') );

  const fromSameDay = deriveFromHistory(sameDayTide, trackOptions, branchOptions);
  const fromSameDayClean = fromSameDay.cleanResult;
  // const fromSameDayTally= fromSameDay.qbranches;
  
  // console.log(fromSameDayTally);
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
  batchNum, widgetId, river, items, nonCon, shortfall, releases, finishTime,
  trackOptions, branchOptions 
) {
  const tStop = tideStop ? tideStop : new Date();

  
  if(!batchNum) {
    return [ 'guessUnsupported', [ "" ] ];
  }
    
    const yourHistory = Array.from( items, x =>
                      x.history.filter( y => y.who === uID || 
                      ( y.type === 'first' && y.info.builder.includes(uID) )
                    ) );
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
        
        const releasePrep = tryFromRelease(tideStart, tStop, releases);
        
        if(releasePrep) {
          return [ 'fromRelease', ['before release'] ];
        }else{
            
          const afterFinish = tryFromFinish(tideStart, finishTime);
          
          if(afterFinish) {
            return [ 'fromAfterFinish', ['after finish'] ];
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


Meteor.methods({
  
  getOneBranchBestGuess(batchNum, tideObj) {
    const accessKey = Meteor.user().orgKey;
    const app = AppDB.findOne({ orgKey: accessKey });
    const branchOptions = app.branches.sort((b1, b2)=> {
          if (b1.position < b2.position) { return 1 }
          if (b1.position > b2.position) { return -1 }
          return 0;
        });
    const trackOptions = [...app.trackOption, app.lastTrack];
    
    const batch = BatchDB.findOne({batch: batchNum, orgKey: accessKey}) ||
                  XBatchDB.findOne({batch: batchNum, orgKey: accessKey});
                  
    const series = XSeriesDB.findOne({batch: batchNum});
    
    const widgetId = batch.widgetId;
    const river = batch.river;
    const releases = batch.releases || [];
    const finishTime = series ? batch.completedAt : batch.finishedAt;
    const items = series ? series.items : batch.items || [];
    const nonCon = series ? series.nonCon : batch.nonCon || [];
    const shortfall = series ? series.shortfall : batch.shortfall || [];
    
    const bestGuess = branchBestGuess(tideObj.who, tideObj.startTime, tideObj.stopTime,
                        batchNum, widgetId, river, items, nonCon, shortfall, 
                        releases, finishTime, trackOptions, branchOptions);
                        
    return bestGuess;
  },
  
  
  assembleBranchTime(batchNum) {
    const accessKey = Meteor.user().orgKey;
    const app = AppDB.findOne({ orgKey: accessKey});
    const branchOptions = app.branches.sort((b1, b2)=>
            b1.position < b2.position ? 1 :b1.position > b2.position ? -1 : 0 );
    const trackOptions = [...app.trackOption, app.lastTrack];
    
    const batch = BatchDB.findOne({batch: batchNum, orgKey: accessKey}) ||
                  XBatchDB.findOne({batch: batchNum, orgKey: accessKey});
                  
    const series = XSeriesDB.findOne({batch: batchNum});
    
    const widgetId = batch.widgetId;
    const river = batch.river;
    const releases = batch.releases || [];
    const finishTime = series ? batch.completedAt : batch.finishedAt;
    const items = series ? series.items : batch.items || [];
    const nonCon = series ? series.nonCon : batch.nonCon || [];
    const shortfall = series ? series.shortfall : batch.shortfall || [];
    
    let slimTimes = [];
    
    if( batch && Array.isArray(batch.tide) ) {  
      const slim = batch.tide.map( x => {
        const known = x.task ? [ 'fromUserInput', [ x.task ] ] : null;
        const dt = known || 
          branchBestGuess(x.who, x.startTime, x.stopTime,
                        batchNum, widgetId, river, items, nonCon, shortfall, 
                        releases, finishTime, trackOptions, branchOptions);
                        
        const mStart = moment(x.startTime);
        const mStop = !x.stopTime ? moment() : moment(x.stopTime);
        const dur = moment.duration(mStop.diff(mStart)).asMinutes();
        return {
          branchGuess: dt,
          duration: dur
        };
      });
      
      const ancOptionS = app.ancillaryOption.sort();
      for(let anc of ancOptionS) {
        let ancDurr = 0;
        for(let t of slim) {
          if( Array.isArray(t.branchGuess)
            && t.branchGuess[1].includes( anc ) ) {
              ancDurr = ancDurr + ( t.duration / t.branchGuess[1].length );
          }
        }
        slimTimes.push({
          x: anc,
          y: ancDurr
        });
      }
      
      for(let br of branchOptions) {
        let brDurr = 0;
        for(let t of slim) {
          if( Array.isArray(t.branchGuess)
            && ( t.branchGuess[1].includes( br.branch ) || 
                t.branchGuess[1].includes( br.branch + ' prep' ) ) ) {
              brDurr = brDurr + ( t.duration / t.branchGuess[1].length );
          }
        }
        slimTimes.push({
          x: br.branch,
          y: brDurr
        });
      }
      let aDurr = 0;
      let zDurr = 0;
      let xDurr = 0;
      for(let t of slim) {
        if( !t.branchGuess || t.branchGuess[1].includes( 'guessUnsupported' ) ) {
          xDurr = xDurr + t.duration;
        }else if( t.branchGuess[1].includes( 'before release' ) ) {
          aDurr = aDurr + t.duration;
        }else if( t.branchGuess[1].includes( 'after finish' ) ) {
          zDurr = zDurr + t.duration;
        }else{
          null;
        }
      }
      slimTimes.unshift({ x: 'before release', y: aDurr });
      slimTimes.push({ x: 'after finish', y: zDurr });
      slimTimes.push({ x: 'unknown', y: xDurr });
      
      return slimTimes;
    }else{
      return slimTimes;
    }
  }
  
  
});

/*
if(rvrstp.type === 'first') {
  const pastFirst = batch.items.some( 
                      x => x.history.find( y => 
                        y.key === rvrstp.key && 
                        y.good === true &&
                        y.time < tideStart ) );
  const futureFirst = batch.items.some( 
                      x => x.history.find( y => 
                        y.key === rvrstp.key && 
                        y.time > tideStart &&
                        y.info.builder.includes(uID) ) );
  
  const prep = pastFirst === false && futureFirst === true;
  if(prep) {
    nextFirstPhase = rvrstp.phase;
    break;
  }
*/


