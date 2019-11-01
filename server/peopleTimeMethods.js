import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';

Meteor.methods({
  
  phaseBestGuess(uID, batchNum, tideStart, tideStop, clientTZ, accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;
    const tStop = tideStop ? tideStop : new Date();
    const batch = BatchDB.findOne({ orgKey: privateKey, batch: batchNum });
    const app = AppDB.findOne({ orgKey: privateKey});
    const phaseDB = [...app.trackOption, app.lastTrack];
     
      
    function deriveHistory(historyObjs) {
      const historyFlat = [].concat(...historyObjs);
      
      const foundKeys = _.pluck(historyFlat, 'key');
      const uniqKeys = _.uniq(foundKeys);
      
      const key2phase = (key)=> {
        const obj = phaseDB.find( x => x.key === key );
        return obj ? obj.phase : null;
      };
      const uniqPhases = _.uniq( Array.from(uniqKeys, x => key2phase(x) ) );
      const cleanResult = uniqPhases.length > 0 ? uniqPhases : false;
      
      return cleanResult;
    }
    
    function deriveNC(ncObjs) {
      const ncFlat = [].concat(...ncObjs);

      const foundWhere = _.pluck(ncFlat, 'where');
      const uniqWhere = _.uniq(foundWhere);
      
      const cleanResult = uniqWhere.length > 0 ? uniqWhere : false;
      
      return cleanResult;
    }
      

    const itemHistoryS = Array.from( batch.items, 
                          x => x.history.filter( y =>
                            y.time > tideStart && 
                            y.time < tStop &&
                            y.who === uID ) );
    const phaseFromStep = deriveHistory(itemHistoryS);
    
    if(phaseFromStep) {
      return [ 'fromStep', phaseFromStep ];
    }else{
      
      const itemHistoryFn = Array.from( batch.items,
                            x => x.history.filter( y =>
                              y.time > tideStart && 
                              y.time < tStop &&
                              y.type === 'first' && 
                              y.info.builder.includes(uID) ) );
      const phaseFromFirst = deriveHistory(itemHistoryFn);
      
      if(phaseFromFirst) {
        return [ 'fromFirst', phaseFromFirst ];
      }else{
        
        const inBncN = batch.nonCon.filter( x =>
          x.time > tideStart && x.time < tStop && x.who === uID );
        const inBncF = batch.nonCon.filter( x =>
          x.fix !== false && x.fix.time > tideStart && x.fix.time < tStop && x.fix.who === uID );
        const inBncI = batch.nonCon.filter( x =>
          x.inspect !== false && x.inspect.time > tideStart && x.inspect.time < tStop && x.inspect.who === uID );
        const anyNC = [...inBncN,...inBncF,...inBncI ] ;
        const phasefromNC = deriveNC(anyNC);
        
        if(phasefromNC) {
          return [ 'fromNC', phasefromNC ];
        }else{
          
          const released = typeof batch.floorRelease === 'object';
          const beforeRelease = !released || moment(tideStop)
                                  .isBefore(batch.floorRelease.time); 
          
          if(beforeRelease) {
            return [ 'fromPreRelease', ['pre release / kitting'] ];
          }else{
            
            const released = typeof batch.floorRelease === 'object';
            const startBeforeRelease = !released || moment(tideStart)
                                        .isBefore(batch.floorRelease.time);
            
            if(startBeforeRelease) {
              return [ 'fromOverRelease', ['kitting / prep'] ];
            }else{
              
              const finished = batch.finishedAt !== false;
              const afterFinish = finished && moment(tideStart)
                                    .isAfter(moment(batch.finishedAt) );
              
              if(afterFinish) {
                return [ 'fromAfterFinish', ['after finish'] ];
              }else{
          
                const cCache = CacheDB.findOne({dataName: 'phaseCondition'});
                const cB = cCache && cCache.dataSet.find( x => x.batch === batchNum );
                const openPhases = cB && cB.phaseSets.filter( x => x.condition === 'open' );
                
                if( !tideStop && openPhases && openPhases.length === 1 ) {
                  return [ 'fromOnlyOpen', [openPhases[0].phase] ];
                }else{
          
                  const itemHistorySh = Array.from( batch.items, 
                                x => x.history.filter( y =>
                                  moment(y.time).tz(clientTZ)
                                    .isSame(moment(tStop).tz(clientTZ), 'hour') && 
                                  y.who === uID ) );
                  const phaseFromHourStep = deriveHistory(itemHistorySh);
                  
                  if(phaseFromHourStep) {
                    return [ 'fromHourStep', phaseFromHourStep ];
                  }else{
            
                    const itemHistoryFh = Array.from( batch.items,
                                        x => x.history.filter( y =>
                                          y.type === 'first' && 
                                          moment(y.time).tz(clientTZ)
                                            .isSame(moment(tideStart).tz(clientTZ), 'hour') &&
                                          y.info.builder.includes(uID) ) );
                    const phaseFromHourFirst = deriveHistory(itemHistoryFh);
                    
                    if(phaseFromHourFirst) {
                      return [ 'fromHourFirst', phaseFromHourFirst ];
                    }else{
          
                      const itemHistorySd = Array.from( batch.items, 
                                    x => x.history.filter( y =>
                                      moment(y.time).tz(clientTZ)
                                        .isSame(moment(tStop).tz(clientTZ), 'day') && 
                                      y.who === uID ) );
                      const phaseFromDayStep = deriveHistory(itemHistorySd);
                      
                      if(phaseFromDayStep) {
                        return [ 'fromDayStep', phaseFromDayStep ];
                      }else{
            
                        const itemHistoryFd = Array.from( batch.items,
                                            x => x.history.filter( y =>
                                              y.type === 'first' && 
                                              moment(y.time).tz(clientTZ)
                                                .isSame(moment(tideStart).tz(clientTZ), 'day') &&
                                              y.info.builder.includes(uID) ) );
                        const phaseFromDayFirst = deriveHistory(itemHistoryFd);
                        
                        if(phaseFromDayFirst) {
                          return [ 'fromDayFirst', phaseFromDayFirst ];
                        }else{
                    
                          const docW = WidgetDB.findOne({_id: batch.widgetId});
                          const flow = docW.flows.find( x => x.flowKey === batch.river );
                          const riverFlow = flow ? flow.flow : [];
                          
                          let nextFirstPhase = false;
                          for(const rvrstp of riverFlow) {
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
                            }
                          }
                          
                          if(nextFirstPhase) {
                            return [ 'fromNextFirst', [`${nextFirstPhase} prep`] ];
                          }else{
                            
                            const docW = WidgetDB.findOne({_id: batch.widgetId});
                            const flow = docW.flows.find( x => x.flowKey === batch.river );
                            const riverFlow = flow ? flow.flow : [];
                            
                            let riverSatus = [];
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
                              }
                            }
                            const nextIndex = riverSatus.indexOf(false);
                            let nextIncompletePhase = nextIndex >= 0 ? 
                                                        riverFlow[nextIndex].phase : null;
                                                        
                            if(nextIncompletePhase) {
                              return [ 'fromNextIncomplete', [`${nextIncompletePhase}`] ];
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
        }
      }
    }
  },
  
  
  assemblePhaseTime(batchID, clientTZ) {
    const accessKey = Meteor.user().orgKey;
    const batch = BatchDB.findOne({_id: batchID, orgKey: accessKey});
    if( batch && Array.isArray(batch.tide) ) {  
      const slim = batch.tide.map( x => {
        const dt = Meteor.call('phaseBestGuess', x.who, batch.batch, x.startTime, x.stopTime, clientTZ, accessKey);
        const mStart = moment(x.startTime);
        const mStop = !x.stopTime ? moment() : moment(x.stopTime);
        const dur = moment.duration(mStop.diff(mStart)).asMinutes();
        return {
          phaseGuess: dt,
          duration: dur
        };
      });
      return slim;
    }else{
      return false;
    }
  },
  
});