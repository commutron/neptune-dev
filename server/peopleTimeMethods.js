import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';

function deriveFromHistory(history, trackOptions, branchOptions) {
  
  const foundTrackKeys = _.pluck(history, 'key');
  
  const key2branch = (key)=> {
    const obj = trackOptions.find( x => x.key === key );
    const branchKey = obj ? obj.branchKey : null;
    const branchObj = branchOptions.find( y => y.brKey === branchKey );
    return branchObj ? branchObj.branch : null;
  };
              // This can be faster if dont care for the count of
  const branches = Array.from(foundTrackKeys, x => key2branch(x) );
  const qbranches = _.countBy(branches, x => x);
  // const qKeysClean = _.omit(qKeys, (value, key)=> {
  //   return key == false;
  // });
  
  const entryBranches = Object.entries(qbranches);
  const uniqBranches = _.uniq( Array.from(entryBranches, z => z[0] ) );

  const cleanResult = uniqBranches.length > 0 && uniqBranches[0] !== null ? 
                      uniqBranches : false;
  return { cleanResult, qbranches};
}

function deriveFromProb(probObjs) {
  const probFlat = [].concat(...probObjs);

  const foundWhere = _.pluck(probFlat, 'where');
  
  const qKeys = _.countBy(foundWhere, x => x);
  const uniqWhere = _.uniq(foundWhere);
  
  const cleanResult = uniqWhere.length > 0 ? uniqWhere : false;
  
  return { cleanResult, qKeys};
}
    
Meteor.methods({

  branchBestGuess(uID, batchNum, tideStart, tideStop, clientTZ, accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;
    const tStop = tideStop ? tideStop : new Date();
    const batch = BatchDB.findOne({ orgKey: privateKey, batch: batchNum });
    const app = AppDB.findOne({ orgKey: privateKey});
    const trackOptions = [...app.trackOption, app.lastTrack];
    const branchOptions = app.branches;
    
    
    const yourHistory = Array.from( batch.items, x =>
                          x.history.filter( y => y.who === uID || 
                          ( y.type === 'first' && y.info.builder.includes(uID) )
                        ) );
    const yourHistoryFlat = [].concat(...yourHistory);
    
    
    const withinTide = yourHistoryFlat.filter( y => y.time > tideStart && 
                                                    y.time < tStop );
    
    const fromHistoryWithin = deriveFromHistory(withinTide, trackOptions, branchOptions);
    const fromHistoryWithinClean = fromHistoryWithin.cleanResult;
    // const fromHistoryWithinTally= fromHistoryWithin.qbranches;
    
    // console.log(fromHistoryWithinTally);
    
    if(fromHistoryWithinClean) {
      return [ 'fromHistory', fromHistoryWithinClean ];
    }else{
      
      const inBncN = batch.nonCon.filter( x =>
        x.time > tideStart && x.time < tStop && x.who === uID );
      const inBncF = batch.nonCon.filter( x =>
        x.fix !== false && x.fix.time > tideStart && x.fix.time < tStop && x.fix.who === uID );
      const inBncI = batch.nonCon.filter( x =>
        x.inspect !== false && x.inspect.time > tideStart && x.inspect.time < tStop && x.inspect.who === uID );
      const anyNC = [...inBncN,...inBncF,...inBncI ] ;
      
      const fromNC = deriveFromProb(anyNC);
      const fromNCclean = fromNC.cleanResult;
      // const fromNCtally = fromNC.qKeys;
      
      // console.log(fromNCtally);
      
      if(fromNCclean) {
        return [ 'fromNC', fromNCclean ];
      }else{
        
        const inBshC = batch.shortfall.filter( x =>
          x.cTime > tideStart && x.cTime < tStop && x.cWho === uID );
        const inBshU = batch.shortfall.filter( x =>
          x.uTime > tideStart && x.uTime < tStop && x.uWho === uID );
          
        const anySH = [...inBshC,...inBshU ] ;
      
        const fromSH = deriveFromProb(anySH);
        const fromSHclean = fromSH.cleanResult;
        // const fromSHtally = fromSH.qKeys;
        
        // console.log(fromSHtally);
        
        if(fromSHclean) {
          return [ 'fromSH', fromSHclean ];
        }else{
        
          const floorRelease = batch.releases.find( x => x.type === 'floorRelease');
  
          const releasePrep = !floorRelease ? true :
                                moment(tStop).isBefore(floorRelease.time) || 
                                moment(tideStart).isBefore(floorRelease.time); 
          
          if(releasePrep) {
            return [ 'fromRelease', ['kitting / prep'] ];
          }else{
              
            const finished = batch.finishedAt !== false;
            const afterFinish = finished && moment(tideStart)
                                  .isAfter(moment(batch.finishedAt) );
            
            if(afterFinish) {
              return [ 'fromAfterFinish', ['after finish'] ];
            }else{
          
              const sameHourTide = yourHistoryFlat.filter( y => // duration ???
                                    moment(y.time).tz(clientTZ)
                                    .isSame(moment(tStop).tz(clientTZ), 'hour') );
      
              const fromSameHour = deriveFromHistory(sameHourTide, trackOptions, branchOptions);
              const fromSameHourClean = fromSameHour.cleanResult;
              // const fromSameHourTally= fromSameHour.qbranches;
              
              // console.log(fromSameHourTally);
               
              if(fromSameHourClean) {
                return [ 'fromSameHourHistory', fromSameHourClean ];
              }else{
            
                const sameDayTide = yourHistoryFlat.filter( y =>
                                    moment(y.time).tz(clientTZ)
                                    .isSame(moment(tStop).tz(clientTZ), 'day') );
      
                const fromSameDay = deriveFromHistory(sameDayTide, trackOptions, branchOptions);
                const fromSameDayClean = fromSameDay.cleanResult;
                // const fromSameDayTally= fromSameDay.qbranches;
                
                // console.log(fromSameDayTally);
                 
                if(fromSameDayClean) {
                  return [ 'fromSameDayHistory', fromSameDayClean ];
                }else{
          
                    
                  if( !tideStop ) {
                    
                    const cCache = CacheDB.findOne({dataName: 'phaseCondition'});
                    const cB = cCache && cCache.dataSet.find( x => x.batch === batchNum );
                    const openPhases = cB && cB.phaseSets.filter( x => x.condition === 'open' );
                    const fromOnlyOpen = openPhases && openPhases.length === 1 ?
                                          openPhases[0].phase : false;
                                          
                    // const brCache = CacheDB.findOne({dataName: 'branchCondition'});
                    // const cB = cCache && brCache.dataSet.find( x => x.batch === batchNum );
                    // const openBranches = cB && cB.branchSets.filter( x => x.condition === 'open' );
                    // const fromOnlyOpen = openBranches && openBranches.length === 1 ?
                    //                       openBranches[0].branchName : false;
                                          
                    if(fromOnlyOpen) {
                      return [ 'fromOnlyOpen', fromOnlyOpen ];
                    }else{
                        
                      const docW = WidgetDB.findOne({_id: batch.widgetId});
                      const flow = docW.flows.find( x => x.flowKey === batch.river );
                      const riverFlow = flow ? flow.flow : [];
                      
                      let riverSatus = [];
                      let remainFirstBranch = new Set();
                      for(const rvrstp of riverFlow) {
                        if(rvrstp.type !== 'first') {
                          const done100 = batch.items.every( 
                                            x => x.history.find( y =>
                                              y.key === rvrstp.key &&
                                              y.good === true &&
                                              y.time < tideStart ) );
                          riverSatus.push(done100);
                        }else{
                          riverSatus.push(null);
                          const someFirst = batch.items.some( 
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
                      
                      if(nextPrepBranch) {
                        const branchObj = branchOptions.find( y => y.brKey === nextPrepBranch );
                        const branchName = branchObj.branch;
                      
                        return [ 'nextPrepBranch', [`${branchName} prep`] ];
                      }else{
                        return false;
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
  },
  
  // still phase
  assembleBranchTime(batchID, clientTZ) {
    const accessKey = Meteor.user().orgKey;
    const app = AppDB.findOne({ orgKey: accessKey});
    const batch = BatchDB.findOne({_id: batchID, orgKey: accessKey});
    if( batch && Array.isArray(batch.tide) ) {  
      const slim = batch.tide.map( x => {
        const dt = Meteor.call('branchBestGuess', x.who, batch.batch, x.startTime, x.stopTime, clientTZ, accessKey);
        const mStart = moment(x.startTime);
        const mStop = !x.stopTime ? moment() : moment(x.stopTime);
        const dur = moment.duration(mStop.diff(mStart)).asMinutes();
        return {
          phaseGuess: dt,
          duration: dur
        };
      });
      
      let slimTimes = [];
      for(let ph of app.phases) {
        let phDurr = 0;
        for(let t of slim) {
          if( Array.isArray(t.phaseGuess) ) {
            if( t.phaseGuess[1].includes( ph ) || 
                t.phaseGuess[1].includes( ph + ' prep' ) ) {
              phDurr = phDurr + ( t.duration / t.phaseGuess[1].length );
            }
          }
        }
        slimTimes.push({
          x: ph,
          y: phDurr
        });
      }
      let aDurr = 0;
      let zDurr = 0;
      let xDurr = 0;
      for(let t of slim) {
        if( !t.phaseGuess ) {
          xDurr = xDurr + t.duration;
        }else if( t.phaseGuess[1].includes( 'kitting / prep' ) ) {
          aDurr = aDurr + t.duration;
        }else if( t.phaseGuess[1].includes( 'after finish' ) ) {
          zDurr = zDurr + t.duration;
        }else{
          null;
        }
      }
      slimTimes.unshift({ x: 'kitting', y: aDurr });
      slimTimes.push({ x: 'after finish', y: zDurr });
      slimTimes.push({ x: 'unknown', y: xDurr });
      
      return slimTimes;
    }else{
      return false;
    }
  },
  
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


